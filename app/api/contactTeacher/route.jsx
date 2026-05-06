import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ====================================================================
// CONFIGURATION (matches api/contact and api/emergency)
// ====================================================================
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SCHOOL_NAME = 'Matungulu Girls Senior School';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'matungulugirls@gmial.com';

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================
function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(07|01|\+2547|\+2541)\d{8}$/;
  return regex.test(cleaned);
}

function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateReferenceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TCH-${year}${month}${day}-${randomNum}`;
}

// ====================================================================
// EMAIL SENDERS
// ====================================================================
async function sendTeacherInquiryEmail(payload, referenceNumber) {
  const {
    name,
    email,
    phone,
    message,
    subject,
    inquiryType,
    contactMethod,
    studentDetails,
    teacherName,
    teacherEmail,
    teacherPosition,
  } = payload;

  const safeMessage = String(message || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const submittedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const mailOptions = {
    // Gmail will typically enforce the authenticated sender, so we use replyTo to
    // ensure the teacher can respond directly to the inquirer.
    from: {
      name: `${SCHOOL_NAME} Inquiries`,
      address: process.env.EMAIL_USER,
    },
    replyTo: {
      name,
      address: email,
    },
    to: teacherEmail,
    subject: `New Inquiry: ${subject} (${referenceNumber})`,
    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="x-apple-disable-message-reformatting" />
          <title>New Inquiry</title>
        </head>
        <body style="margin:0; padding:0; background:#f3f4f6;">
          <!-- Preheader (hidden) -->
          <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all;">
            New inquiry for ${teacherName || 'staff'} — Ref ${referenceNumber}
          </div>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6; padding:24px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding:22px 22px 18px 22px; background:#0f766e;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#ffffff;">
                        <div style="font-size:12px; letter-spacing:0.14em; font-weight:700; text-transform:uppercase; opacity:0.95;">
                          ${SCHOOL_NAME}
                        </div>
                        <div style="margin-top:6px; font-size:20px; font-weight:800; line-height:1.2;">
                          New inquiry received
                        </div>
                        <div style="margin-top:10px;">
                          <span style="display:inline-block; background:rgba(255,255,255,0.16); border:1px solid rgba(255,255,255,0.18); padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700;">
                            Ref: ${referenceNumber}
                          </span>
                          <span style="display:inline-block; margin-left:8px; background:rgba(255,255,255,0.10); border:1px solid rgba(255,255,255,0.18); padding:6px 10px; border-radius:999px; font-size:12px; font-weight:600;">
                            ${inquiryType || 'General'}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:22px;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#111827; line-height:1.6;">
                        <p style="margin:0 0 14px 0; color:#374151;">
                          An inquiry was submitted through the staff directory.
                        </p>

                        <!-- Summary cards -->
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate; border-spacing:0; margin:0 0 14px 0;">
                          <tr>
                            <td style="padding:12px 14px; border:1px solid #e5e7eb; border-radius:12px; background:#fafafa;">
                              <div style="font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em;">To</div>
                              <div style="font-size:14px; font-weight:800; color:#111827;">
                                ${teacherName || 'Staff'}${teacherPosition ? ` <span style="font-weight:600; color:#6b7280;">• ${teacherPosition}</span>` : ''}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate; border-spacing:0; margin:0 0 14px 0;">
                          <tr>
                            <td style="padding:12px 14px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff;">
                              <div style="font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em;">From</div>
                              <div style="font-size:14px; font-weight:800; color:#111827;">${name}</div>
                              <div style="font-size:13px; color:#374151; margin-top:2px;">
                                ${email} <span style="color:#9ca3af;">•</span> ${phone}
                              </div>
                              <div style="font-size:12px; color:#6b7280; margin-top:8px;">
                                Preferred contact: <strong style="color:#111827;">${contactMethod || 'email'}</strong>
                                <span style="color:#9ca3af;">•</span> Submitted: ${submittedAt}
                              </div>
                              ${studentDetails ? `<div style="font-size:12px; color:#6b7280; margin-top:6px;">Student details: <strong style="color:#111827;">${String(studentDetails).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong></div>` : ''}
                            </td>
                          </tr>
                        </table>

                        <div style="margin:0 0 8px 0; font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em;">
                          Subject
                        </div>
                        <div style="margin:0 0 16px 0; padding:12px 14px; border:1px solid #e5e7eb; border-radius:12px; background:#fafafa; font-weight:700; color:#111827;">
                          ${String(subject || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                        </div>

                        <div style="margin:0 0 8px 0; font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em;">
                          Message
                        </div>
                        <div style="white-space:pre-wrap; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff; padding:14px; color:#111827;">
                          ${safeMessage}
                        </div>

                        <p style="margin:14px 0 0 0; color:#6b7280; font-size:12px;">
                          Tip: hit “Reply” to respond directly to the inquirer (reply-to: ${email}).
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:16px 22px; background:#f9fafb; border-top:1px solid #e5e7eb;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size:12px; color:#6b7280; line-height:1.5;">
                        This message was generated by ${SCHOOL_NAME}. If you received it in error, ignore it.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendInquirerConfirmationEmail(toEmail, name, teacherName, referenceNumber) {
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Contact Center`,
      address: process.env.EMAIL_USER,
    },
    to: toEmail,
    subject: `✅ Inquiry Received - ${SCHOOL_NAME}`,
    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="x-apple-disable-message-reformatting" />
          <title>Inquiry Received</title>
        </head>
        <body style="margin:0; padding:0; background:#f3f4f6;">
          <!-- Preheader (hidden) -->
          <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all;">
            We’ve received your inquiry — Ref ${referenceNumber}
          </div>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6; padding:24px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
                  <tr>
                    <td style="padding:22px; background:#0f766e;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#ffffff;">
                        <div style="font-size:12px; letter-spacing:0.14em; font-weight:700; text-transform:uppercase; opacity:0.95;">
                          ${SCHOOL_NAME}
                        </div>
                        <div style="margin-top:6px; font-size:20px; font-weight:800; line-height:1.2;">
                          Inquiry received
                        </div>
                        <div style="margin-top:10px;">
                          <span style="display:inline-block; background:rgba(255,255,255,0.16); border:1px solid rgba(255,255,255,0.18); padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700;">
                            Ref: ${referenceNumber}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:22px;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#111827; line-height:1.6;">
                        <p style="margin:0 0 10px 0; color:#111827; font-size:16px; font-weight:800;">
                          Hello ${String(name || 'there').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')},
                        </p>
                        <p style="margin:0 0 14px 0; color:#374151;">
                          Your inquiry has been received${teacherName ? ` and routed to <strong>${String(teacherName).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong>` : ''}.
                          The teacher will respond shortly.
                        </p>

                        <div style="border:1px solid #e5e7eb; border-radius:12px; background:#fafafa; padding:14px;">
                          <div style="font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em;">Reference</div>
                          <div style="margin-top:4px; font-size:16px; font-weight:800; color:#111827;">${referenceNumber}</div>
                        </div>

                        <p style="margin:14px 0 0 0; color:#6b7280; font-size:12px;">
                          If you need follow-up, reply to this email or contact us at ${CONTACT_EMAIL}.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:16px 22px; background:#f9fafb; border-top:1px solid #e5e7eb;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size:12px; color:#6b7280; line-height:1.5;">
                        © ${new Date().getFullYear()} ${SCHOOL_NAME}. This is an automated confirmation.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// ====================================================================
// POST REQUEST HANDLER
// ====================================================================
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      message,
      subject,
      inquiryType,
      contactMethod,
      studentDetails,
      teacherId,
      teacherName,
      teacherEmail,
      teacherPosition,
    } = body || {};

    // Validation (consistent with existing API routes)
    if (!name || !email || !phone || !message || !subject || !teacherEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!validateEmail(email) || !validateEmail(teacherEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const referenceNumber = generateReferenceNumber();

    const payload = {
      name,
      email,
      phone,
      message,
      subject,
      inquiryType,
      contactMethod,
      studentDetails,
      teacherId,
      teacherName,
      teacherEmail,
      teacherPosition,
    };

    await sendTeacherInquiryEmail(payload, referenceNumber);
    await sendInquirerConfirmationEmail(email, name, teacherName, referenceNumber);

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        referenceNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Teacher inquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
