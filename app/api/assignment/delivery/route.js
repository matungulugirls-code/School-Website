import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { normalizePhoneNumber, sendWhatsAppMessage } from "../../../../libs/whatsapp";

export const dynamic = "force-dynamic";

const decodeJwtPayload = (token) => {
  const payload = token.split('.')[1];
  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(
    normalizedPayload.length + ((4 - normalizedPayload.length % 4) % 4),
    '='
  );

  return JSON.parse(Buffer.from(paddedPayload, 'base64').toString('utf-8'));
};

const authenticateDeliveryRequest = (req) => {
  const adminToken = req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace('Bearer ', '');
  const deviceToken = req.headers.get('x-device-token');

  if (!adminToken || !deviceToken) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Access Denied', message: 'Admin and device tokens are required' },
        { status: 401 }
      )
    };
  }

  try {
    if (adminToken.split('.').length !== 3) throw new Error('Invalid admin token format');
    JSON.parse(Buffer.from(deviceToken, 'base64').toString('utf-8'));

    const adminPayload = decodeJwtPayload(adminToken);
    if (adminPayload.exp && adminPayload.exp < Date.now() / 1000) {
      throw new Error('Admin token has expired');
    }

    const userRole = String(adminPayload.role || adminPayload.userRole || '').toUpperCase();
    const validRoles = ['ADMIN', 'SUPER_ADMIN', 'ADMINISTRATOR', 'PRINCIPAL', 'TEACHER', 'STAFF'];
    if (!validRoles.includes(userRole)) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { success: false, error: 'Access Denied', message: 'You do not have permission to send assignment delivery messages' },
          { status: 403 }
        )
      };
    }

    return { authenticated: true, user: adminPayload };
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Access Denied', message: error.message || 'Invalid authentication headers' },
        { status: 401 }
      )
    };
  }
};

/**
 * GET /api/assignment/delivery/[id]
 * Get delivery status and details for an assignment
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const assignmentIdStr = searchParams.get("assignmentId");

    if (!assignmentIdStr) {
      return NextResponse.json(
        { success: false, error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    const assignmentId = parseInt(assignmentIdStr);

    const deliveryRecipients = await prisma.assignmentDeliveryRecipient.findMany({
      where: { assignmentId },
      orderBy: [{ createdAt: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: deliveryRecipients,
      count: deliveryRecipients.length,
    });
  } catch (error) {
    console.error("Error fetching delivery recipients:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/assignment/delivery/send
 * Send pending WhatsApp messages to students/parents
 *
 * Request body:
 * {
 *   assignmentId: int,
 *   recipientIds: string[] (optional - send to specific recipients only)
 * }
 */
export async function POST(req) {
  try {
    const auth = authenticateDeliveryRequest(req);
    if (!auth.authenticated) return auth.response;

    const body = await req.json();
    const { assignmentId, recipientIds } = body;

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    // Fetch assignment details
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Fetch delivery recipients
    const where = { assignmentId };
    if (recipientIds && recipientIds.length > 0) {
      where.id = { in: recipientIds };
    }

    const recipients = await prisma.assignmentDeliveryRecipient.findMany({
      where,
      include: {
        student: {
          select: {
            whatsappPhone: true,
            parentPhone: true,
            studentPhone: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
          },
        },
      },
    });

    console.log(`📨 Assignment delivery recipients found: ${recipients.length}`);

    if (recipients.length === 0) {
      await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          deliveryStatus: 'no_recipients',
          deliverySummary: {
            successCount: 0,
            failureCount: 0,
            totalRecipients: 0,
            sentAt: new Date().toISOString(),
            results: [],
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'WhatsApp delivery completed. No recipients found.',
        data: {
          successCount: 0,
          failureCount: 0,
          totalRecipients: 0,
          results: [],
        },
      });
    }

    // Prepare and send messages
    const sendResults = [];
    let successCount = 0;
    let failureCount = 0;

    for (const recipient of recipients) {
      // Prefer uploaded student phones (student.whatsappPhone -> parentPhone -> studentPhone)
      const candidates = [
        recipient.student?.whatsappPhone,
        recipient.student?.parentPhone,
        recipient.student?.studentPhone,
        recipient.whatsappPhone // fallback to recipient-level override
      ];

      let normalizedPhone = null;
      for (const cand of candidates) {
        const norm = normalizePhoneNumber(cand);
        if (norm) {
          normalizedPhone = norm;
          break;
        }
      }

      if (!normalizedPhone) {
        await prisma.assignmentDeliveryRecipient.update({
          where: { id: recipient.id },
          data: { status: "failed", updatedAt: new Date() },
        });

        sendResults.push({
          recipientId: recipient.id,
          admissionNumber: recipient.admissionNumber,
          success: false,
          error: "No phone number available",
        });
        failureCount++;
        continue;
      }

      // Build message
      const studentName =
        recipient.studentName ||
        (recipient.student
          ? `${recipient.student.firstName} ${recipient.student.lastName}`.trim()
          : "Student");

      const dueDateText = assignment.dueDate
        ? new Date(assignment.dueDate).toLocaleDateString()
        : "Check the student portal";
      const message = `Hi, please check the new assignment: "${assignment.title}". Subject: ${assignment.subject}. Due: ${dueDateText}. Instructions: ${assignment.description?.substring(0, 100) || "See details in student portal"}...`;

      // Send WhatsApp message
      const sendResult = await sendWhatsAppMessage(normalizedPhone, message);

      if (sendResult.success) {
        successCount++;
        // Update recipient status
        await prisma.assignmentDeliveryRecipient.update({
          where: { id: recipient.id },
          data: {
            status: "sent",
            updatedAt: new Date(),
          },
        });
      } else {
        failureCount++;
        await prisma.assignmentDeliveryRecipient.update({
          where: { id: recipient.id },
          data: { status: "failed", updatedAt: new Date() },
        });
      }

      sendResults.push({
        recipientId: recipient.id,
        admissionNumber: recipient.admissionNumber,
        studentName,
        phoneNumber: normalizedPhone,
        ...sendResult,
      });
    }

    // Update assignment delivery status
    await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        deliveryStatus: successCount > 0 ? "sent" : "failed",
        deliverySummary: {
          successCount,
          failureCount,
          totalRecipients: recipients.length,
          sentAt: new Date().toISOString(),
          results: sendResults,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `WhatsApp delivery completed. ${successCount} sent, ${failureCount} failed`,
      data: {
        successCount,
        failureCount,
        totalRecipients: recipients.length,
        results: sendResults,
      },
    });
  } catch (error) {
    console.error("Error sending WhatsApp messages:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/assignment/delivery/resend
 * Resend failed WhatsApp messages
 */
export async function PUT(req) {
  try {
    const auth = authenticateDeliveryRequest(req);
    if (!auth.authenticated) return auth.response;

    const body = await req.json();
    const { assignmentId, failedRecipientIds } = body;

    if (!assignmentId || !failedRecipientIds || failedRecipientIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Assignment ID and failed recipient IDs are required" },
        { status: 400 }
      );
    }

    // Fetch failed recipients
    const recipients = await prisma.assignmentDeliveryRecipient.findMany({
      where: {
        assignmentId,
        id: { in: failedRecipientIds },
      },
      include: {
        student: {
          select: {
            whatsappPhone: true,
            parentPhone: true,
            studentPhone: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "No recipients found" },
        { status: 404 }
      );
    }

    // Get assignment details
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Resend messages
    const resendResults = [];
    let successCount = 0;

    for (const recipient of recipients) {
      const phoneNumber =
        recipient.whatsappPhone ||
        recipient.student?.whatsappPhone ||
        recipient.student?.parentPhone ||
        recipient.student?.studentPhone;

      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      if (!normalizedPhone) {
        resendResults.push({
          recipientId: recipient.id,
          success: false,
          error: "Invalid phone number",
        });
        continue;
      }

      const dueDateText = assignment.dueDate
        ? new Date(assignment.dueDate).toLocaleDateString()
        : "the date shown in the student portal";
      const message = `Reminder: Assignment "${assignment.title}" is due on ${dueDateText}. Please submit on time.`;
      const sendResult = await sendWhatsAppMessage(normalizedPhone, message);

      if (sendResult.success) {
        successCount++;
        await prisma.assignmentDeliveryRecipient.update({
          where: { id: recipient.id },
          data: { status: "sent" },
        });
      }

      resendResults.push({
        recipientId: recipient.id,
        ...sendResult,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Resent ${successCount} messages`,
      data: {
        successCount,
        failureCount: resendResults.length - successCount,
        results: resendResults,
      },
    });
  } catch (error) {
    console.error("Error resending messages:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
