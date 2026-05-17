import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../../libs/prisma';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'matungulugirls@gmail.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
const SCHOOL_NAME = 'Matungulu Girls Senior School';
const RESET_TOKEN_BYTES = 32;
const RESET_LINK_MINUTES = 60;

const normalizeAdmissionNumber = (value = '') =>
  String(value || '').trim().toUpperCase();

const normalizeEmail = (value = '') =>
  String(value || '').trim().toLowerCase();

const hashToken = (token = '') =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

const escapeHtml = (value = '') =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getClientIp = (request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')?.[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
};

const getBaseUrl = (request) => {
  const configured = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || process.env.BASE_URL;
  if (configured) return configured.replace(/\/$/, '');

  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  const host = request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  return host ? `${proto}://${host}` : '';
};

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
  email: student.email || fallback.email || fallback.parentEmail || null,
  parentPhone: student.parentPhone || fallback.parentPhone || null,
  status: student.status || 'active'
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

const validateStrongPassword = (password = '') => {
  const value = String(password);
  const failures = [];

  if (value.length < 8) failures.push('at least 8 characters');
  if (!/[a-z]/.test(value)) failures.push('one lowercase letter');
  if (!/[A-Z]/.test(value)) failures.push('one uppercase letter');
  if (!/\d/.test(value)) failures.push('one number');
  if (!/[^A-Za-z0-9]/.test(value)) failures.push('one symbol');

  return {
    valid: failures.length === 0,
    message: failures.length
      ? `Password must include ${failures.join(', ')}.`
      : ''
  };
};

const generateTemporaryPassword = () => {
  const random = crypto.randomBytes(6).toString('base64url');
  return `Mg-${random}9!`;
};

const createResetRecord = async ({
  request,
  student,
  account,
  requestType,
  message,
  adminNote = null,
}) => {
  const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('base64url');
  const expiresAt = new Date(Date.now() + RESET_LINK_MINUTES * 60 * 1000);
  const parentEmail = normalizeEmail(student.email || account?.email || '');

  const requestRecord = await prisma.studentPasswordResetRequest.create({
    data: {
      admissionNumber: student.admissionNumber,
      requestType,
      fullName: buildFullName(student) || account?.fullName || null,
      email: student.email || account?.email || null,
      parentEmail: parentEmail || null,
      parentPhone: student.parentPhone || account?.parentPhone || null,
      message: message || null,
      tokenHash: hashToken(token),
      expiresAt,
      status: 'pending',
      adminNote,
      requestedByIp: getClientIp(request),
      requestedByUserAgent: (request.headers.get('user-agent') || 'unknown').slice(0, 255)
    }
  });

  return { token, expiresAt, requestRecord };
};

const buildResetLink = (request, token) =>
  `${getBaseUrl(request)}/pages/studentpasswordreset?token=${encodeURIComponent(token)}`;

const sendParentResetEmail = async ({ to, student, resetLink, requestType, expiresAt }) => {
  const transporter = getTransporter();
  if (!transporter) return false;

  const actionLabel = requestType === 'admin_setup'
    ? 'create a student portal password'
    : 'reset the student portal password';
  const title = requestType === 'change'
    ? 'Student Portal Password Change'
    : requestType === 'admin_setup'
      ? 'Student Portal Password Setup'
      : 'Student Portal Password Reset';
  const fullName = buildFullName(student) || student.admissionNumber;

  await transporter.sendMail({
    from: {
      name: `${SCHOOL_NAME} Student Portal`,
      address: process.env.EMAIL_USER
    },
    to,
    subject: `${title}: ${student.admissionNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:white;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
          <div style="background:#020617;color:white;padding:24px;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#94a3b8;">${escapeHtml(SCHOOL_NAME)}</p>
            <h1 style="margin:0;font-size:24px;">${escapeHtml(title)}</h1>
          </div>
          <div style="padding:24px;">
            <p>Hello Parent/Guardian,</p>
            <p>
              A secure request was made to ${escapeHtml(actionLabel)} for
              <strong>${escapeHtml(fullName)}</strong>
              (Admission <strong>${escapeHtml(student.admissionNumber)}</strong>).
            </p>
            <p style="margin:24px 0;">
              <a href="${resetLink}" style="display:inline-block;background:#020617;color:white;text-decoration:none;padding:14px 22px;border-radius:14px;font-weight:800;">
                Open Secure Password Link
              </a>
            </p>
            <p style="color:#475569;font-size:14px;">
              This link expires on <strong>${expiresAt.toLocaleString('en-US')}</strong> and can only be used once.
            </p>
            <p style="color:#475569;font-size:14px;">
              If the button does not work, paste this link into your browser:<br />
              <span style="word-break:break-all;color:#2563eb;">${resetLink}</span>
            </p>
            <div style="margin-top:22px;padding:14px;border-radius:14px;background:#fef3c7;color:#78350f;font-size:14px;">
              If you did not expect this message, ignore it and contact the school office.
            </div>
          </div>
        </div>
      </div>
    `,
    text: `${title}\n\nA secure request was made to ${actionLabel} for ${fullName} (${student.admissionNumber}).\n\nOpen this link within ${RESET_LINK_MINUTES} minutes:\n${resetLink}\n\nIf you did not expect this message, ignore it and contact the school office.`
  });

  return true;
};

const getActiveStudentWithAccount = async (admissionNumber) => {
  const cleanAdmissionNumber = normalizeAdmissionNumber(admissionNumber);
  if (!cleanAdmissionNumber) return { student: null, account: null };

  const [student, account] = await Promise.all([
    prisma.databaseStudent.findUnique({
      where: { admissionNumber: cleanAdmissionNumber }
    }),
    prisma.studentPortalAccount.findUnique({
      where: { admissionNumber: cleanAdmissionNumber }
    })
  ]);

  return { student, account };
};

const findValidResetByToken = async (token) => {
  if (!token) return null;

  const tokenHash = hashToken(token);
  return prisma.studentPasswordResetRequest.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      status: {
        in: ['pending', 'sent']
      },
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: { requestedAt: 'desc' }
  });
};

const buildAccountRows = async ({ search = '', status = 'all' }) => {
  const where = search
    ? {
        OR: [
          { admissionNumber: { contains: search } },
          { firstName: { contains: search } },
          { middleName: { contains: search } },
          { lastName: { contains: search } },
          { form: { contains: search } },
          { stream: { contains: search } },
          { email: { contains: search } },
          { parentPhone: { contains: search } }
        ]
      }
    : {};

  const [students, accounts] = await Promise.all([
    prisma.databaseStudent.findMany({
      where,
      orderBy: [
        { form: 'asc' },
        { stream: 'asc' },
        { admissionNumber: 'asc' }
      ],
      take: 2000,
      select: {
        id: true,
        admissionNumber: true,
        firstName: true,
        middleName: true,
        lastName: true,
        form: true,
        stream: true,
        status: true,
        email: true,
        parentPhone: true,
        updatedAt: true
      }
    }),
    prisma.studentPortalAccount.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 2000,
      select: {
        id: true,
        admissionNumber: true,
        fullName: true,
        firstName: true,
        middleName: true,
        lastName: true,
        form: true,
        stream: true,
        email: true,
        parentPhone: true,
        passwordHash: true,
        passwordSetAt: true,
        lastLoginAt: true,
        status: true,
        updatedAt: true
      }
    })
  ]);

  const studentAdmissionNumbers = new Set(students.map(student => student.admissionNumber));
  const accountMap = new Map(accounts.map(account => [account.admissionNumber, account]));

  const rows = students.map((student) => {
    const account = accountMap.get(student.admissionNumber);
    const parentEmail = normalizeEmail(student.email || account?.email || '');
    return {
      id: student.id,
      accountId: account?.id || null,
      admissionNumber: student.admissionNumber,
      fullName: buildFullName(student) || account?.fullName || student.admissionNumber,
      form: student.form,
      stream: student.stream,
      studentStatus: student.status,
      parentEmail,
      parentPhone: student.parentPhone || account?.parentPhone || null,
      hasPassword: Boolean(account?.passwordHash),
      passwordSetAt: account?.passwordSetAt || null,
      lastLoginAt: account?.lastLoginAt || null,
      accountUpdatedAt: account?.updatedAt || null,
      currentlyInDashboard: true,
      canAccessPortal: student.status === 'active' && Boolean(account?.passwordHash),
      canSendSetupEmail: student.status === 'active' && Boolean(parentEmail)
    };
  });

  const orphanAccounts = accounts
    .filter(account => !studentAdmissionNumbers.has(account.admissionNumber))
    .filter(account => {
      if (!search) return true;
      const haystack = [
        account.admissionNumber,
        account.fullName,
        account.form,
        account.stream,
        account.email,
        account.parentPhone
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(search.toLowerCase());
    })
    .map(account => ({
      id: account.id,
      accountId: account.id,
      admissionNumber: account.admissionNumber,
      fullName: account.fullName || buildFullName(account) || account.admissionNumber,
      form: account.form,
      stream: account.stream,
      studentStatus: 'missing-record',
      parentEmail: normalizeEmail(account.email || ''),
      parentPhone: account.parentPhone || null,
      hasPassword: Boolean(account.passwordHash),
      passwordSetAt: account.passwordSetAt || null,
      lastLoginAt: account.lastLoginAt || null,
      accountUpdatedAt: account.updatedAt || null,
      currentlyInDashboard: false,
      canAccessPortal: false,
      canSendSetupEmail: false
    }));

  const stats = {
    totalStudents: rows.length,
    activeStudents: rows.filter(row => row.studentStatus === 'active').length,
    passwordSet: rows.filter(row => row.hasPassword).length,
    passwordNotSet: rows.filter(row => !row.hasPassword).length,
    missingParentEmail: rows.filter(row => !row.parentEmail).length,
    orphanAccounts: orphanAccounts.length
  };

  let filteredRows = rows;
  if (status === 'set') filteredRows = rows.filter(row => row.hasPassword);
  if (status === 'not-set') filteredRows = rows.filter(row => !row.hasPassword);
  if (status === 'missing-email') filteredRows = rows.filter(row => !row.parentEmail);
  if (status === 'orphan') filteredRows = orphanAccounts;
  if (status === 'all-with-orphans') filteredRows = [...rows, ...orphanAccounts];

  return {
    rows: filteredRows,
    orphanAccounts,
    stats
  };
};

const handleStudentResetRequest = async (request, body) => {
  const admissionNumber = normalizeAdmissionNumber(body?.admissionNumber || body?.identifier);
  const requestType = body?.requestType === 'change' || body?.action === 'request-change-password'
    ? 'change'
    : 'forgot';
  const currentPassword = String(body?.currentPassword || body?.previousPassword || '');
  const message = String(body?.message || '').trim();

  if (!admissionNumber) {
    return NextResponse.json(
      { success: false, error: 'Admission number is required.' },
      { status: 400 }
    );
  }

  const { student, account } = await getActiveStudentWithAccount(admissionNumber);

  if (!student || student.status !== 'active') {
    return NextResponse.json(
      {
        success: false,
        requiresContact: true,
        error: 'Student record is not active in the dashboard. Please contact the school office.'
      },
      { status: 404 }
    );
  }

  const parentEmail = normalizeEmail(student.email || account?.email || '');
  if (!parentEmail) {
    return NextResponse.json(
      {
        success: false,
        requiresContact: true,
        error: 'No parent email is registered for this student. Please ask admin to update the student record.'
      },
      { status: 400 }
    );
  }

  if (requestType === 'change') {
    if (!account?.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'No current portal password exists. Use First-Time Access or Forgot Password.' },
        { status: 400 }
      );
    }

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Enter your current password to request a password change.' },
        { status: 400 }
      );
    }

    const passwordMatches = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 401 }
      );
    }
  }

  const { token, expiresAt, requestRecord } = await createResetRecord({
    request,
    student,
    account,
    requestType,
    message: message || (requestType === 'change' ? 'Student requested a password change.' : 'Student requested password recovery.')
  });

  const resetLink = buildResetLink(request, token);
  let emailSent = false;
  try {
    emailSent = await sendParentResetEmail({
      to: parentEmail,
      student,
      resetLink,
      requestType,
      expiresAt
    });
  } catch (mailError) {
    console.error('Student password reset parent email failed:', mailError);
  }

  if (emailSent) {
    await prisma.studentPasswordResetRequest.update({
      where: { id: requestRecord.id },
      data: { status: 'sent' }
    });
  }

  return NextResponse.json({
    success: true,
    message: emailSent
      ? 'A secure password link has been sent to the registered parent email.'
      : 'Request saved, but the email service is not configured. Please contact admin.',
    emailSent,
    expiresAt
  }, { status: 201 });
};

const handleAdminSetupLinks = async (request, body, admin) => {
  const admissionNumbers = Array.isArray(body?.admissionNumbers)
    ? body.admissionNumbers.map(normalizeAdmissionNumber).filter(Boolean)
    : [normalizeAdmissionNumber(body?.admissionNumber)].filter(Boolean);

  if (admissionNumbers.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Select at least one student.' },
      { status: 400 }
    );
  }

  const students = await prisma.databaseStudent.findMany({
    where: {
      admissionNumber: { in: admissionNumbers },
      status: 'active'
    }
  });

  const accounts = await prisma.studentPortalAccount.findMany({
    where: { admissionNumber: { in: students.map(student => student.admissionNumber) } }
  });
  const accountMap = new Map(accounts.map(account => [account.admissionNumber, account]));

  const results = [];
  for (const student of students) {
    const account = accountMap.get(student.admissionNumber);
    const parentEmail = normalizeEmail(student.email || account?.email || '');

    if (!parentEmail) {
      results.push({
        admissionNumber: student.admissionNumber,
        success: false,
        error: 'No parent email registered.'
      });
      continue;
    }

    const { token, expiresAt, requestRecord } = await createResetRecord({
      request,
      student,
      account,
      requestType: 'admin_setup',
      message: 'Admin sent a parent password setup link.',
      adminNote: `Setup link sent by ${admin.name}.`
    });

    const resetLink = buildResetLink(request, token);
    let emailSent = false;

    try {
      emailSent = await sendParentResetEmail({
        to: parentEmail,
        student,
        resetLink,
        requestType: 'admin_setup',
        expiresAt
      });
    } catch (mailError) {
      console.error(`Student setup email failed for ${student.admissionNumber}:`, mailError);
    }

    if (emailSent) {
      await prisma.studentPasswordResetRequest.update({
        where: { id: requestRecord.id },
        data: { status: 'sent' }
      });
    }

    results.push({
      admissionNumber: student.admissionNumber,
      success: emailSent,
      emailSent,
      parentEmail,
      error: emailSent ? null : 'Email service is not configured or delivery failed.'
    });
  }

  const sent = results.filter(item => item.success).length;
  return NextResponse.json({
    success: sent > 0,
    message: sent > 0
      ? `Sent ${sent} password setup ${sent === 1 ? 'email' : 'emails'}.`
      : 'No password setup emails were sent.',
    sent,
    failed: results.length - sent,
    results
  }, { status: sent > 0 ? 200 : 400 });
};

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body?.action || 'request-reset-link';

    if (action === 'admin-send-setup-link' || action === 'admin-send-setup-links') {
      const admin = parseAdminFromRequest(request);
      if (!admin) {
        return NextResponse.json({ success: false, error: 'Admin authentication required.' }, { status: 401 });
      }

      return handleAdminSetupLinks(request, body, admin);
    }

    return handleStudentResetRequest(request, body);
  } catch (error) {
    console.error('Student password reset request error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not submit password request.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token) {
    const resetRequest = await findValidResetByToken(token);
    if (!resetRequest) {
      return NextResponse.json(
        { success: false, error: 'This password link is invalid or expired.' },
        { status: 404 }
      );
    }

    const { student, account } = await getActiveStudentWithAccount(resetRequest.admissionNumber);
    if (!student || student.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Student record is not active in the dashboard.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      requestType: resetRequest.requestType,
      expiresAt: resetRequest.expiresAt,
      student: {
        admissionNumber: student.admissionNumber,
        fullName: buildFullName(student),
        form: student.form,
        stream: student.stream,
        hasPassword: Boolean(account?.passwordHash)
      }
    });
  }

  const admin = parseAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin authentication required.' }, { status: 401 });
  }

  const scope = searchParams.get('scope') || 'requests';

  if (scope === 'accounts') {
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const accountData = await buildAccountRows({ status, search });

    return NextResponse.json({
      success: true,
      ...accountData
    });
  }

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
      tokenHash: undefined,
      account: accountMap.get(item.admissionNumber) || null,
      student: studentMap.get(item.admissionNumber) || null
    }))
  });
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const action = body?.action;

    if (action === 'complete-reset') {
      const resetRequest = await findValidResetByToken(body?.token);
      if (!resetRequest) {
        return NextResponse.json(
          { success: false, error: 'This password link is invalid or expired.' },
          { status: 404 }
        );
      }

      const passwordToSet = String(body?.newPassword || '');
      if (passwordToSet !== String(body?.confirmPassword || '')) {
        return NextResponse.json(
          { success: false, error: 'Passwords do not match.' },
          { status: 400 }
        );
      }

      const passwordValidation = validateStrongPassword(passwordToSet);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { success: false, error: passwordValidation.message },
          { status: 400 }
        );
      }

      const { student, account } = await getActiveStudentWithAccount(resetRequest.admissionNumber);
      if (!student || student.status !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Student record is not active in the dashboard.' },
          { status: 403 }
        );
      }

      const passwordHash = await bcrypt.hash(passwordToSet, 12);

      await prisma.$transaction([
        prisma.studentPortalAccount.upsert({
          where: { admissionNumber: student.admissionNumber },
          update: {
            passwordHash,
            ...buildAccountSnapshot(student, account || {}),
            passwordSetAt: new Date(),
            status: 'active'
          },
          create: {
            admissionNumber: student.admissionNumber,
            passwordHash,
            ...buildAccountSnapshot(student, account || {}),
            passwordSetAt: new Date(),
            status: 'active'
          }
        }),
        prisma.studentPasswordResetRequest.update({
          where: { id: resetRequest.id },
          data: {
            usedAt: new Date(),
            resolvedAt: new Date(),
            status: 'resolved'
          }
        }),
        prisma.studentSession.deleteMany({
          where: { admissionNumber: student.admissionNumber }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: 'Student portal password updated successfully.'
      });
    }

    const admin = parseAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin authentication required.' }, { status: 401 });
    }

    const { id, status, adminNote } = body || {};
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

      if (!student || student.status !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Student record is not active in the dashboard.' },
          { status: 403 }
        );
      }

      await prisma.studentPortalAccount.upsert({
        where: { admissionNumber: requestRecord.admissionNumber },
        update: {
          passwordHash,
          ...buildAccountSnapshot(student, requestRecord),
          passwordSetAt: new Date()
        },
        create: {
          admissionNumber: requestRecord.admissionNumber,
          passwordHash,
          ...buildAccountSnapshot(student, requestRecord),
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
    console.error('Student password reset update error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not update password request.' },
      { status: 500 }
    );
  }
}
