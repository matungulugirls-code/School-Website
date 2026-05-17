import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../../libs/prisma';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'matungulugirls@gmial.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
const SCHOOL_NAME = 'Matungulu Girls Senior School';

const normalizeAdmissionNumber = (value = '') =>
  String(value || '').trim().toUpperCase();

const buildFullName = (record = {}) =>
  [record.firstName, record.middleName, record.lastName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim() || record.fullName || '';

const buildAccountSnapshot = (student = {}, fallback = {}) => ({
  firstName: student.firstName || fallback.firstName || null,
  middleName: student.middleName || fallback.middleName || null,
  lastName: student.lastName || fallback.lastName || null,
  fullName: buildFullName(student) || fallback.fullName || null,
  form: student.form || fallback.form || null,
  stream: student.stream || fallback.stream || null,
  email: student.email || fallback.email || null,
  parentPhone: student.parentPhone || fallback.parentPhone || null,
  status: 'active'
});

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const parseAdminFromRequest = (request) => {
  const token = request.headers.get('x-admin-token') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) return null;

  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
    const role = String(payload.role || payload.userRole || '').toUpperCase();
    const validRoles = ['ADMIN', 'SUPER_ADMIN', 'PRINCIPAL', 'STAFF', 'HR_MANAGER', 'TEACHER'];

    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    if (!validRoles.includes(role)) return null;

    return {
      id: payload.userId || payload.id,
      name: payload.name || payload.email || 'Admin',
      email: payload.email,
      role
    };
  } catch {
    return null;
  }
};

const sendAdminRequestEmail = async (requestRecord) => {
  const transporter = getTransporter();
  if (!transporter) return false;

  await transporter.sendMail({
    from: {
      name: `${SCHOOL_NAME} Student Portal`,
      address: process.env.EMAIL_USER
    },
    to: ADMIN_EMAIL,
    subject: `Student portal password help: ${requestRecord.admissionNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
        <div style="max-width:640px;margin:0 auto;background:white;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
          <div style="background:#020617;color:white;padding:22px;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#94a3b8;">Student Portal</p>
            <h1 style="margin:0;font-size:22px;">Password Assistance Request</h1>
          </div>
          <div style="padding:22px;">
            <p><strong>Admission Number:</strong> ${requestRecord.admissionNumber}</p>
            <p><strong>Name:</strong> ${requestRecord.fullName || 'Not provided'}</p>
            <p><strong>Email:</strong> ${requestRecord.email || 'Not provided'}</p>
            <p><strong>Parent Phone:</strong> ${requestRecord.parentPhone || 'Not provided'}</p>
            <p><strong>Message:</strong> ${requestRecord.message || 'No extra message'}</p>
            <p style="margin-top:18px;color:#475569;">Open the admin dashboard password requests panel to issue a temporary password or mark the request resolved.</p>
          </div>
        </div>
      </div>
    `
  });

  return true;
};

const generateTemporaryPassword = () => {
  const random = crypto.randomBytes(6).toString('base64url');
  return `Mg-${random}9!`;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const admissionNumber = normalizeAdmissionNumber(body?.admissionNumber || body?.identifier);
    const fullName = String(body?.fullName || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const parentPhone = String(body?.parentPhone || '').trim();
    const message = String(body?.message || '').trim();

    if (!admissionNumber) {
      return NextResponse.json(
        { success: false, error: 'Admission number is required.' },
        { status: 400 }
      );
    }

    if (!fullName && !email && !parentPhone) {
      return NextResponse.json(
        { success: false, error: 'Provide your name, email, or parent phone so admin can verify you.' },
        { status: 400 }
      );
    }

    const student = await prisma.databaseStudent.findUnique({
      where: { admissionNumber }
    });

    const requestRecord = await prisma.studentPasswordResetRequest.create({
      data: {
        admissionNumber,
        fullName: fullName || buildFullName(student) || null,
        email: email || student?.email || null,
        parentPhone: parentPhone || student?.parentPhone || null,
        message: message || null,
        status: 'pending'
      }
    });

    let emailSent = false;
    try {
      emailSent = await sendAdminRequestEmail(requestRecord);
    } catch (mailError) {
      console.error('Student password reset admin email failed:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? 'Request sent to the school admin.'
        : 'Request saved. Email service is not configured, so admin can view it in the dashboard.',
      request: requestRecord,
      emailSent
    }, { status: 201 });
  } catch (error) {
    console.error('Student password reset request error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not submit password request.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const admin = parseAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin authentication required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const requests = await prisma.studentPasswordResetRequest.findMany({
    where: status && status !== 'all' ? { status } : {},
    orderBy: { requestedAt: 'desc' },
    take: 100
  });

  const admissionNumbers = [...new Set(requests.map(item => item.admissionNumber))];
  const [accounts, students] = await Promise.all([
    prisma.studentPortalAccount.findMany({
      where: { admissionNumber: { in: admissionNumbers } },
      select: {
        admissionNumber: true,
        passwordSetAt: true,
        lastLoginAt: true,
        fullName: true,
        form: true,
        stream: true
      }
    }),
    prisma.databaseStudent.findMany({
      where: { admissionNumber: { in: admissionNumbers } },
      select: {
        admissionNumber: true,
        firstName: true,
        middleName: true,
        lastName: true,
        form: true,
        stream: true,
        status: true
      }
    })
  ]);

  const accountMap = new Map(accounts.map(item => [item.admissionNumber, item]));
  const studentMap = new Map(students.map(item => [item.admissionNumber, item]));

  return NextResponse.json({
    success: true,
    requests: requests.map(item => ({
      ...item,
      account: accountMap.get(item.admissionNumber) || null,
      student: studentMap.get(item.admissionNumber) || null
    }))
  });
}

export async function PATCH(request) {
  const admin = parseAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin authentication required.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, adminNote, action } = body || {};

    if (!id) {
      return NextResponse.json({ success: false, error: 'Request id is required.' }, { status: 400 });
    }

    const requestRecord = await prisma.studentPasswordResetRequest.findUnique({ where: { id } });
    if (!requestRecord) {
      return NextResponse.json({ success: false, error: 'Request not found.' }, { status: 404 });
    }

    if (action === 'issue-temporary-password') {
      const tempPassword = generateTemporaryPassword();
      const passwordHash = await bcrypt.hash(tempPassword, 12);
      const student = await prisma.databaseStudent.findUnique({
        where: { admissionNumber: requestRecord.admissionNumber }
      });

      await prisma.studentPortalAccount.upsert({
        where: { admissionNumber: requestRecord.admissionNumber },
        update: {
          passwordHash,
          ...(student ? buildAccountSnapshot(student, requestRecord) : buildAccountSnapshot({}, requestRecord)),
          passwordSetAt: new Date()
        },
        create: {
          admissionNumber: requestRecord.admissionNumber,
          passwordHash,
          ...(student ? buildAccountSnapshot(student, requestRecord) : buildAccountSnapshot({}, requestRecord)),
          passwordSetAt: new Date()
        }
      });

      const updatedRequest = await prisma.studentPasswordResetRequest.update({
        where: { id },
        data: {
          status: 'resolved',
          adminNote: adminNote || `Temporary password issued by ${admin.name}.`,
          resolvedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        request: updatedRequest,
        temporaryPassword: tempPassword,
        message: 'Temporary password issued. It is shown once; share it only with the verified student/parent.'
      });
    }

    const nextStatus = status || requestRecord.status;
    const updatedRequest = await prisma.studentPasswordResetRequest.update({
      where: { id },
      data: {
        status: nextStatus,
        adminNote: adminNote ?? requestRecord.adminNote,
        resolvedAt: nextStatus === 'resolved' ? new Date() : requestRecord.resolvedAt
      }
    });

    return NextResponse.json({ success: true, request: updatedRequest });
  } catch (error) {
    console.error('Student password reset admin update error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not update password request.' },
      { status: 500 }
    );
  }
}
