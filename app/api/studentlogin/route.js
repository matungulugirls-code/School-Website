import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../../libs/prisma';

// Constants
const FALLBACK_STUDENT_JWT_SECRET = 'Matungulu-student-secret-key-2024';
const STUDENT_TOKEN_EXPIRY = '2h';
const STUDENT_SESSION_SECONDS = 2 * 60 * 60;
const PASSWORD_SETUP_EXPIRY = '10m';

const getJwtSecret = () => {
  const secret = process.env.STUDENT_JWT_SECRET || process.env.JWT_SECRET;

  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('Student authentication secret is not configured.');
  }

  return secret || FALLBACK_STUDENT_JWT_SECRET;
};

const normalizeAdmissionNumber = (value = '') =>
  String(value || '').trim().toUpperCase();

const hashToken = (token = '') =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

const getClientIp = (request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')?.[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
};

const extractCookieValue = (request, key) => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  return cookieHeader.split(';').reduce((value, cookie) => {
    if (value) return value;
    const [name, ...parts] = cookie.trim().split('=');
    return name === key ? parts.join('=') : null;
  }, null);
};

const extractStudentToken = (request) =>
  extractCookieValue(request, 'student_token') ||
  request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
  null;

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

const buildFullName = (student) => {
  const fullName = [student?.firstName, student?.middleName, student?.lastName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return fullName || student?.fullName || '';
};

const buildAccountSnapshot = (student) => ({
  firstName: student.firstName || null,
  middleName: student.middleName || null,
  lastName: student.lastName || null,
  fullName: buildFullName(student) || null,
  form: student.form || null,
  stream: student.stream || null,
  email: student.email || null,
  parentPhone: student.parentPhone || null,
  status: 'active'
});

const cleanupExpiredStudentCredentialArchives = async () => {
  try {
    await prisma.archivedStudentPortalCredential.deleteMany({
      where: {
        expiresAt: { lte: new Date() }
      }
    });
  } catch (error) {
    console.warn('Student credential archive cleanup skipped:', error?.message || error);
  }
};

const restoreArchivedAccountForStudent = async (student) => {
  if (!student?.admissionNumber || student.status !== 'active') return null;

  await cleanupExpiredStudentCredentialArchives();

  const archive = await prisma.archivedStudentPortalCredential.findFirst({
    where: {
      admissionNumber: student.admissionNumber,
      expiresAt: { gt: new Date() }
    }
  });

  if (!archive?.passwordHash) return null;

  const account = await prisma.studentPortalAccount.upsert({
    where: { admissionNumber: student.admissionNumber },
    update: {
      ...buildAccountSnapshot(student),
      passwordSetAt: archive.passwordSetAt || undefined
    },
    create: {
      admissionNumber: student.admissionNumber,
      passwordHash: archive.passwordHash,
      ...buildAccountSnapshot(student),
      passwordSetAt: archive.passwordSetAt || new Date(),
      lastLoginAt: archive.lastLoginAt || null
    }
  });

  await prisma.archivedStudentPortalCredential.update({
    where: { admissionNumber: student.admissionNumber },
    data: {
      restoredAt: new Date(),
      status: 'restored'
    }
  });

  return account;
};

const buildPortalProfile = (student = null, account = null) => {
  const source = student || account;

  if (!source) return null;

  return {
    id: student?.id || account?.id,
    studentRecordId: student?.id || null,
    portalAccountId: account?.id || null,
    admissionNumber: source.admissionNumber,
    firstName: source.firstName || null,
    lastName: source.lastName || null,
    middleName: source.middleName || null,
    fullName: buildFullName(source) || source.fullName || source.admissionNumber,
    form: source.form || null,
    stream: source.stream || null,
    email: source.email || null,
    gender: student?.gender || null,
    dateOfBirth: student?.dateOfBirth || null,
    parentPhone: source.parentPhone || null,
    address: student?.address || null,
    status: student?.status || account?.status || 'active',
    fromPortalAccount: !student,
    hasPortalPassword: Boolean(account?.passwordHash)
  };
};

const sanitizeStudent = (student, account = null) => buildPortalProfile(student, account);

// Generate student JWT token
const generateStudentToken = (student) => {
  return jwt.sign(
    {
      studentId: student.id,
      studentRecordId: student.studentRecordId || null,
      portalAccountId: student.portalAccountId || null,
      admissionNumber: student.admissionNumber,
      name: student.fullName || buildFullName(student),
      form: student.form,
      stream: student.stream,
      role: 'student',
    },
    getJwtSecret(),
    { expiresIn: STUDENT_TOKEN_EXPIRY }
  );
};

const generatePasswordSetupToken = (student) => jwt.sign(
  {
    studentId: student.id,
    admissionNumber: student.admissionNumber,
    role: 'student',
    purpose: 'student-password-setup'
  },
  getJwtSecret(),
  { expiresIn: PASSWORD_SETUP_EXPIRY }
);

const verifyPasswordSetupToken = (token) => {
  const decoded = jwt.verify(token, getJwtSecret());
  if (decoded?.role !== 'student' || decoded?.purpose !== 'student-password-setup') {
    throw new Error('Invalid setup token');
  }
  return decoded;
};

// Clean and normalize name for comparison
const normalizeName = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^a-z\s]/g, '') // Remove special characters and numbers
    .split(' ')
    .filter(word => word.length > 0) // Remove empty strings
    .sort(); // Sort alphabetically for comparison
};

// Find student by admission number with flexible name matching
const findStudentByName = (student, nameParts) => {
  // Get all possible name combinations from database student
  const dbNameVariations = [
    student.firstName?.toLowerCase() || '',
    student.lastName?.toLowerCase() || '',
    student.middleName?.toLowerCase() || ''
  ].filter(name => name && name.length > 0);

  // Sort both arrays for comparison
  const sortedNameParts = [...nameParts].sort();
  const sortedDbNames = [...dbNameVariations].sort();

  // Check if all entered name parts exist in database names
  const allPartsMatch = sortedNameParts.every(part => {
    return sortedDbNames.some(dbName => {
      // Exact match or partial match (for abbreviations)
      return dbName === part || 
             dbName.startsWith(part) || 
             part.startsWith(dbName) ||
             (part.length === 1 && dbName[0] === part); // Handle initials
    });
  });

  return allPartsMatch;
};

// Validate student credentials with flexible name matching
const validateStudentCredentials = async (fullName, admissionNumber) => {
  try {
    // Clean inputs
    const cleanAdmissionNumber = admissionNumber.trim().toUpperCase();
    const cleanFullName = fullName.trim();

    // Parse and normalize name parts
    const nameParts = normalizeName(cleanFullName);
    
    if (nameParts.length < 1) {
      return { 
        success: false, 
        error: 'Please enter your name',
        requiresContact: false 
      };
    }

    // Find student by admission number
    const student = await prisma.databaseStudent.findUnique({
      where: { 
        admissionNumber: cleanAdmissionNumber
      }
    });

    if (!student) {
      return { 
        success: false, 
        error: 'Student not found with this admission number. Please contact your class teacher or the school administrator/secretary to add or confirm your records.',
        requiresContact: true 
      };
    }

    // Check if student is active
    if (student.status !== 'active') {
      return { 
        success: false, 
        error: 'Student account is not active. Please contact your class teacher or the school administrator/secretary.',
        requiresContact: true 
      };
    }

    // Check name match with flexible matching
    const isNameMatch = findStudentByName(student, nameParts);

    if (!isNameMatch) {
      return { 
        success: false, 
        error: 'Name does not match admission number. Please check and try again, or contact your class teacher or the school administrator/secretary to confirm your details.',
        requiresContact: true 
      };
    }

    return { 
      success: true, 
      student 
    };

  } catch (error) {
    console.error('Student validation error:', error);
    return { 
      success: false, 
      error: 'Authentication failed. Please try again.',
      requiresContact: false 
    };
  }
};

const createStudentSessionResponse = async (request, student, account, message = 'Login successful') => {
  const profile = buildPortalProfile(student?.studentRecordId || student?.fromPortalAccount ? null : student, account) || student;
  const token = generateStudentToken(profile);
  const tokenDigest = hashToken(token);

  try {
    await prisma.studentSession.create({
      data: {
        studentId: profile.id,
        admissionNumber: profile.admissionNumber,
        name: profile.fullName || profile.admissionNumber,
        token: tokenDigest,
        expiresAt: new Date(Date.now() + STUDENT_SESSION_SECONDS * 1000),
        ipAddress: getClientIp(request),
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });
  } catch (sessionError) {
    console.warn('Could not create student session:', sessionError);
  }

  const response = NextResponse.json({
    success: true,
    message,
    student: profile,
    token,
    expiresIn: '2 hours',
    permissions: {
      canViewResources: true,
      canViewAssignments: true,
      canDownloadMaterials: true
    }
  }, { status: 200 });

  response.cookies.set('student_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: STUDENT_SESSION_SECONDS
  });
  response.headers.set('Cache-Control', 'no-store');

  return response;
};

const createPasswordSetupResponse = (student, account = null) => {
  const setupToken = generatePasswordSetupToken(student);

  const response = NextResponse.json({
    success: true,
    requiresPasswordSetup: true,
    message: 'Name verified. Create a strong portal password to finish setup.',
    student: sanitizeStudent(student, account),
    setupToken,
    setupExpiresIn: '10 minutes',
    passwordRules: [
      'At least 8 characters',
      'Uppercase and lowercase letters',
      'At least one number',
      'At least one symbol'
    ]
  }, { status: 200 });

  response.headers.set('Cache-Control', 'no-store');
  return response;
};

// POST - Student Login
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      action,
      fullName,
      admissionNumber,
      identifier,
      password,
      newPassword,
      confirmPassword,
      setupToken
    } = body || {};

    const requestedAction = action || (
      setupToken ? 'setup-password' :
      identifier ? 'login' :
      password && !fullName ? 'login' :
      newPassword ? 'legacy-first-access' :
      'verify-first-access'
    );

    if (requestedAction === 'setup-password') {
      if (!setupToken) {
        return NextResponse.json(
          { success: false, requiresPasswordSetup: true, error: 'Password setup has expired. Please verify your record again.' },
          { status: 400 }
        );
      }

      const passwordToSet = newPassword || password;
      if (!passwordToSet) {
        return NextResponse.json(
          { success: false, requiresPasswordSetup: true, error: 'New password is required.' },
          { status: 400 }
        );
      }

      if (confirmPassword !== undefined && String(passwordToSet) !== String(confirmPassword)) {
        return NextResponse.json(
          { success: false, requiresPasswordSetup: true, error: 'Passwords do not match.' },
          { status: 400 }
        );
      }

      let decodedSetup;
      try {
        decodedSetup = verifyPasswordSetupToken(setupToken);
      } catch (tokenError) {
        return NextResponse.json(
          { success: false, requiresPasswordSetup: true, error: 'Password setup has expired. Please verify your record again.' },
          { status: 401 }
        );
      }

      const student = await prisma.databaseStudent.findUnique({
        where: { id: decodedSetup.studentId }
      });

      if (!student || student.admissionNumber !== decodedSetup.admissionNumber || student.status !== 'active') {
        return NextResponse.json(
          {
            success: false,
            requiresContact: true,
            error: 'Student record is unavailable or inactive. Please contact your class teacher or the school office.'
          },
          { status: 403 }
        );
      }

      const existingAccount = await prisma.studentPortalAccount.findUnique({
        where: { admissionNumber: student.admissionNumber }
      });

      if (existingAccount?.passwordHash) {
        return NextResponse.json(
          {
            success: false,
            requiresPassword: true,
            error: 'A portal password already exists. Please use Password Login.'
          },
          { status: 409 }
        );
      }

      const passwordValidation = validateStrongPassword(passwordToSet);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            requiresPasswordSetup: true,
            error: passwordValidation.message
          },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(String(passwordToSet), 12);

      let account;
      try {
        account = await prisma.studentPortalAccount.create({
          data: {
            admissionNumber: student.admissionNumber,
            passwordHash,
            ...buildAccountSnapshot(student),
            passwordSetAt: new Date(),
            lastLoginAt: new Date()
          }
        });
      } catch (createError) {
        if (createError?.code === 'P2002') {
          return NextResponse.json(
            {
              success: false,
              requiresPassword: true,
              error: 'A portal password already exists. Please use Password Login.'
            },
            { status: 409 }
          );
        }
        throw createError;
      }

      return createStudentSessionResponse(request, student, account, 'Password created and login successful');
    }

    const cleanAdmissionNumber = normalizeAdmissionNumber(identifier || admissionNumber);

    if (!cleanAdmissionNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admission number is required' 
        },
        { status: 400 }
      );
    }

    let account = await prisma.studentPortalAccount.findUnique({
      where: { admissionNumber: cleanAdmissionNumber }
    });

    const student = await prisma.databaseStudent.findUnique({
      where: { admissionNumber: cleanAdmissionNumber }
    });

    if (!account?.passwordHash && student?.status === 'active') {
      account = await restoreArchivedAccountForStudent(student) || account;
    }

    if (requestedAction === 'login') {
      if (!student || student.status !== 'active') {
        return NextResponse.json(
          {
            success: false,
            authenticated: false,
            requiresContact: true,
            error: 'Student record is not active in the dashboard. Please contact the school office.'
          },
          { status: 403 }
        );
      }

      if (!account?.passwordHash) {
        return NextResponse.json(
          {
            success: false,
            requiresPasswordSetup: true,
            error: 'No portal password has been created for this admission number. Use First-Time Access to verify your name and create one.'
          },
          { status: 401 }
        );
      }

      if (!password) {
        return NextResponse.json(
          {
            success: false,
            requiresPassword: true,
            error: 'Enter your portal password to continue.'
          },
          { status: 401 }
        );
      }

      const passwordMatches = await bcrypt.compare(String(password), account.passwordHash);
      if (!passwordMatches) {
        return NextResponse.json(
          {
            success: false,
            requiresPassword: true,
            error: 'Incorrect password. Please check it and try again.'
          },
          { status: 401 }
        );
      }

      const updatedAccount = await prisma.studentPortalAccount.update({
        where: { admissionNumber: cleanAdmissionNumber },
        data: {
          ...buildAccountSnapshot(student),
          lastLoginAt: new Date()
        }
      });

      return createStudentSessionResponse(request, student, updatedAccount);
    }

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student not found with this admission number. Please contact your class teacher or the school administrator/secretary to add or confirm your records.',
          requiresContact: true
        },
        { status: 404 }
      );
    }

    if (student.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Student account is not active. Please contact your class teacher or the school administrator/secretary.',
          requiresContact: true
        },
        { status: 403 }
      );
    }

    if (account?.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          requiresPassword: true,
          error: 'A portal password already exists for this admission number. Please use Password Login.'
        },
        { status: 409 }
      );
    }

    // First-time login still uses the existing admission/name verification rule.
    const validation = await validateStudentCredentials(fullName || '', cleanAdmissionNumber);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          requiresContact: validation.requiresContact || false
        },
        { status: validation.requiresContact ? 404 : 401 }
      );
    }

    if (!newPassword) {
      return createPasswordSetupResponse(student, null);
    }

    if (confirmPassword !== undefined && String(newPassword) !== String(confirmPassword)) {
      return NextResponse.json(
        {
          success: false,
          requiresPasswordSetup: true,
          error: 'Passwords do not match.'
        },
        { status: 400 }
      );
    }

    const passwordValidation = validateStrongPassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          requiresPasswordSetup: true,
          error: passwordValidation.message
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(String(newPassword), 12);
    let newAccount;

    try {
      newAccount = await prisma.studentPortalAccount.create({
        data: {
          admissionNumber: cleanAdmissionNumber,
          passwordHash,
          ...buildAccountSnapshot(student),
          passwordSetAt: new Date(),
          lastLoginAt: new Date()
        }
      });
    } catch (createError) {
      if (createError?.code === 'P2002') {
        return NextResponse.json(
          {
            success: false,
            requiresPassword: true,
            error: 'A portal password has already been created for this admission number. Please use Password Login.'
          },
          { status: 409 }
        );
      }
      throw createError;
    }

    return createStudentSessionResponse(request, student, newAccount, 'Password created and login successful');

  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// GET - Verify student token
export async function GET(request) {
  try {
    const token = extractStudentToken(request);

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          error: 'No token provided' 
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, getJwtSecret());

    // Check if token is for student
    if (decoded.role !== 'student') {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          error: 'Invalid token type' 
        },
        { status: 401 }
      );
    }

    const account = await prisma.studentPortalAccount.findUnique({
      where: { admissionNumber: decoded.admissionNumber }
    });

    const student = decoded.studentRecordId || decoded.studentId
      ? await prisma.databaseStudent.findFirst({
          where: {
            OR: [
              ...(decoded.studentRecordId ? [{ id: decoded.studentRecordId }] : []),
              ...(decoded.studentId ? [{ id: decoded.studentId }] : []),
              { admissionNumber: decoded.admissionNumber }
            ]
          }
        })
      : await prisma.databaseStudent.findUnique({
          where: { admissionNumber: decoded.admissionNumber }
        });

    if (!student || student.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Student record is not active in the dashboard.',
          requiresContact: true
        },
        { status: 401 }
      );
    }

    // Verify the token is still backed by an active server-side session.
    try {
      const tokenDigest = hashToken(token);
      const session = await prisma.studentSession.findFirst({
        where: {
          OR: [
            { token: tokenDigest },
            { token }
          ],
          expiresAt: {
            gt: new Date()
          }
        }
      });

      if (!session) {
        return NextResponse.json(
          {
            success: false,
            authenticated: false,
            error: 'Session expired. Please log in again.',
            requiresReauth: true
          },
          { status: 401 }
        );
      }
    } catch (sessionError) {
      console.error('Student session check failed:', sessionError);
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Unable to verify session. Please log in again.',
          requiresReauth: true
        },
        { status: 401 }
      );
    }

    const profile = buildPortalProfile(student?.status === 'active' ? student : null, account);

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      student: {
        ...profile,
        name: profile.fullName || profile.admissionNumber,
      },
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          error: 'Session expired. Please log in again.',
          requiresReauth: true 
        },
        { status: 401 }
      );
    }

    console.error('Token verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        error: 'Invalid token' 
      },
      { status: 401 }
    );
  }
}

// DELETE - Student Logout
export async function DELETE(request) {
  try {
    const token = extractStudentToken(request);

    // If we have a token and studentSession exists, try to delete the session
    if (token && prisma.studentSession) {
      try {
        await prisma.studentSession.deleteMany({
          where: {
            OR: [
              { token: hashToken(token) },
              { token }
            ]
          }
        });
      } catch (error) {
        console.warn('Error deleting session (might not exist in schema):', error);
      }
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      }
    );
    response.cookies.set('student_token', '', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
      expires: new Date(0)
    });
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
