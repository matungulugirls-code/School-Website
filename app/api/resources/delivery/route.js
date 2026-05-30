import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { normalizePhoneNumber, sendWhatsAppMessage } from "../../../../libs/whatsapp";

export const dynamic = "force-dynamic";

/**
 * GET /api/resources/delivery/[id]
 * Get delivery status and details for a resource
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const resourceIdStr = searchParams.get("resourceId");

    if (!resourceIdStr) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    const resourceId = parseInt(resourceIdStr);

    const deliveryRecipients = await prisma.resourceDeliveryRecipient.findMany({
      where: { resourceId },
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
 * POST /api/resources/delivery/send
 * Send pending WhatsApp messages to students/parents for resource
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { resourceId, recipientIds } = body;

    if (!resourceId) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    // Fetch resource details
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Fetch delivery recipients
    const where = { resourceId };
    if (recipientIds && recipientIds.length > 0) {
      where.id = { in: recipientIds };
    }

    const recipients = await prisma.resourceDeliveryRecipient.findMany({
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

    console.log(`📨 Resource delivery recipients found: ${recipients.length}`);

    if (recipients.length === 0) {
      await prisma.resource.update({
        where: { id: resourceId },
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

      const message = `Hi, a new learning resource has been shared: "${resource.title}". Subject: ${resource.subject}. Description: ${resource.description?.substring(0, 100) || "See details in student portal"}...`;

      // Send WhatsApp message
      const sendResult = await sendWhatsAppMessage(normalizedPhone, message);

      if (sendResult.success) {
        successCount++;
        // Update recipient status
        await prisma.resourceDeliveryRecipient.update({
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

    // Update resource delivery status
    await prisma.resource.update({
      where: { id: resourceId },
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
 * PUT /api/resources/delivery/resend
 * Resend failed WhatsApp messages
 */
export async function PUT(req) {
  try {
    const body = await req.json();
    const { resourceId, failedRecipientIds } = body;

    if (!resourceId || !failedRecipientIds || failedRecipientIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Resource ID and failed recipient IDs are required" },
        { status: 400 }
      );
    }

    // Fetch failed recipients
    const recipients = await prisma.resourceDeliveryRecipient.findMany({
      where: {
        resourceId,
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

    // Get resource details
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
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

      const message = `Reminder: Learning resource "${resource.title}" is now available in the student portal. Please access it.`;
      const sendResult = await sendWhatsAppMessage(normalizedPhone, message);

      if (sendResult.success) {
        successCount++;
        await prisma.resourceDeliveryRecipient.update({
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
