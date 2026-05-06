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
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 10px 0;">New Staff Inquiry</h2>
        <p style="margin: 0 0 14px 0;">
          You have received a new inquiry via the ${SCHOOL_NAME} staff directory.
        </p>

        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; background: #ffffff;">
          <p style="margin: 0 0 6px 0;"><strong>Reference:</strong> ${referenceNumber}</p>
          <p style="margin: 0 0 6px 0;"><strong>To:</strong> ${teacherName || 'Staff'} (${teacherPosition || 'N/A'})</p>
          <p style="margin: 0 0 6px 0;"><strong>From:</strong> ${name} (${email})</p>
          <p style="margin: 0 0 6px 0;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 0 0 6px 0;"><strong>Inquiry Type:</strong> ${inquiryType || 'general'}</p>
          <p style="margin: 0 0 6px 0;"><strong>Preferred Contact:</strong> ${contactMethod || 'email'}</p>
          ${studentDetails ? `<p style="margin: 0 0 6px 0;"><strong>Student Details:</strong> ${studentDetails}</p>` : ''}
          <p style="margin: 12px 0 6px 0;"><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px;">${String(message).replace(/</g, '&lt;')}</div>
        </div>

        <p style="margin: 14px 0 0 0; color: #6b7280; font-size: 12px;">
          Replying to this email will respond to the inquirer (${email}).
        </p>
      </div>
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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 10px 0;">Your inquiry has been received</h2>
        <p style="margin: 0 0 10px 0;">Hello ${name || 'there'},</p>
        <p style="margin: 0 0 10px 0;">
          Thank you for reaching out. Your inquiry has been received${teacherName ? ` and forwarded to <strong>${teacherName}</strong>` : ''}.
          The teacher will respond shortly.
        </p>
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; background: #f9fafb;">
          <p style="margin: 0;"><strong>Reference:</strong> ${referenceNumber}</p>
        </div>
        <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 12px;">
          If you need follow-up, reply to this email or contact us at ${CONTACT_EMAIL}.
        </p>
      </div>
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

