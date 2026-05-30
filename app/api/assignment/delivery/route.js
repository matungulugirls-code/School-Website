import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { normalizePhoneNumber, sendWhatsAppMessage } from "../../../../libs/whatsapp";

export const dynamic = "force-dynamic";

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
      orderBy: [{ cbeRoleType: "asc" }, { createdAt: "asc" }],
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
      // Get parent phone number
      let phoneNumber =
        recipient.whatsappPhone ||
        recipient.student?.whatsappPhone ||
        recipient.student?.parentPhone ||
        recipient.student?.studentPhone ||
        recipient.whatsappPhone;

      if (!phoneNumber) {
        sendResults.push({
          recipientId: recipient.id,
          admissionNumber: recipient.admissionNumber,
          success: false,
          error: "No phone number available",
        });
        failureCount++;
        continue;
      }

      // Normalize phone number
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      if (!normalizedPhone) {
        sendResults.push({
          recipientId: recipient.id,
          admissionNumber: recipient.admissionNumber,
          success: false,
          error: "Invalid phone number format",
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

      const message = `Hi, please check the new assignment: "${assignment.title}". Subject: ${assignment.subject}. Due: ${new Date(assignment.dueDate).toLocaleDateString()}. Instructions: ${assignment.description?.substring(0, 100) || "See details in student portal"}...`;

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

      const message = `Reminder: Assignment "${assignment.title}" is due on ${new Date(assignment.dueDate).toLocaleDateString()}. Please submit on time.`;
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
