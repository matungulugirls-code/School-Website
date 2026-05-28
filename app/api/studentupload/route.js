import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from '../../../libs/prisma';
import {
  ACADEMIC_LEVEL_OPTIONS,
  SCHOOL_COMMUNICATION_NUMBER,
  normalizeAcademicLevel,
  resolveDeliveryRecipients
} from '../../../libs/delivery';

export const maxDuration = 300;

const normalizeLocalMobilePhone = (value = '') => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return null;
  if (/^07\d{8}$/.test(digits)) return digits;
  if (/^7\d{8}$/.test(digits)) return `0${digits}`;
  if (/^2547\d{8}$/.test(digits)) return `0${digits.slice(3)}`;
  return String(value || '').trim();
};

const isLocalMobilePhone = (value = '') => /^07\d{8}$/.test(String(value || ''));

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
    try {
      // Extract tokens from headers
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      // Validate admin token format (basic check)
      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      // Validate device token
      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      // Parse admin token payload
      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        // Check expiration
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        // Check user role - only admins/SchoolTeam can manage students
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER', 'TEACHER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage students' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Student management authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole
        },
        deviceInfo: deviceValid.payload
      };

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { 
        valid: false, 
        reason: 'validation_error', 
        message: 'Authentication validation failed',
        error: error.message 
      };
    }
  }

  // Validate device token
  static validateDeviceToken(token) {
    try {
      // Handle base64 decoding safely
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      // Check age (30 days max)
      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      if (createdAt < thirtyDaysAgo) {
        return { valid: false, reason: 'age_expired', payload, error: 'Device token is too old' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: 'invalid_format', error: error.message };
    }
  }
}

// Authentication middleware for protected requests
const authenticateRequest = (req) => {
  const headers = req.headers;
  
  // Validate tokens
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to manage student data.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.deviceInfo
  };
};

// ========== HELPER FUNCTIONS ==========

const normalizeColumnKey = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const getSourceRowNumber = (record, fallbackIndex = 0) =>
  Number(record?.sourceRowNumber || record?.__rowNumber || fallbackIndex + 2);

const normalizeLooseKey = (value = '') =>
  normalizeColumnKey(value).replace(/student|learner|pupil/g, '');

const extractAcademicLevel = (...values) => {
  for (const value of values) {
    const text = String(value || '').trim();
    if (!text) continue;

    const direct = normalizeAcademicLevel(text);
    if (VALID_STUDENT_LEVELS.includes(direct)) return direct;

    const match = text.match(/\b(grade\s*1[0-2]|g\s*1[0-2]|form\s*[1-4]|f\s*[1-4])\b/i);
    if (match) {
      const matchedLevel = normalizeAcademicLevel(match[1]);
      if (VALID_STUDENT_LEVELS.includes(matchedLevel)) return matchedLevel;
    }

    const numericMatch = text.match(/\b([1-4])\b/);
    if (numericMatch) {
      const matchedLevel = normalizeAcademicLevel(numericMatch[1]);
      if (VALID_STUDENT_LEVELS.includes(matchedLevel)) return matchedLevel;
    }
  }

  return '';
};

const splitStudentName = (fullName = '') => {
  const parts = String(fullName || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  if (parts.length === 0) {
    return { firstName: '', middleName: null, lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], middleName: null, lastName: parts[0] };
  }

  return {
    firstName: parts[0],
    middleName: parts.length > 2 ? parts.slice(1, -1).join(' ') : null,
    lastName: parts[parts.length - 1]
  };
};

const buildClassName = (form, stream, className) =>
  String(className || [form, stream].filter(Boolean).join(' ') || form || '')
    .replace(/\s+/g, ' ')
    .trim() || null;

const LARGE_UPLOAD_ROW_THRESHOLD = 800;
const DB_BATCH_SIZE = 200;
const LARGE_UPLOAD_TIMEOUT_MS = 240000;
const STANDARD_UPLOAD_TIMEOUT_MS = 90000;
const STUDENT_ARCHIVE_RETENTION_DAYS = 60;
const VALID_STUDENT_LEVELS = ACADEMIC_LEVEL_OPTIONS;

const chunkArray = (items = [], size = DB_BATCH_SIZE) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const createManyInChunks = async (delegate, rows, options = {}) => {
  let total = 0;

  for (const chunk of chunkArray(rows)) {
    const result = await delegate.createMany({
      data: chunk,
      ...options
    });
    total += result?.count || 0;
  }

  return total;
};

const buildStudentFullName = (student = {}) =>
  (student.fullName ||
  [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim());

const getArchiveExpiryDate = () =>
  new Date(Date.now() + STUDENT_ARCHIVE_RETENTION_DAYS * 24 * 60 * 60 * 1000);

const cleanupExpiredStudentCredentialArchives = async (tx = prisma) => {
  try {
    await tx.archivedStudentPortalCredential.deleteMany({
      where: {
        expiresAt: { lte: new Date() }
      }
    });
  } catch (error) {
    console.warn('Student credential archive cleanup skipped:', error?.message || error);
  }
};

const archiveStudentPortalCredentials = async (
  tx,
  students = [],
  { sourceBatchId = null, archiveReason = 'batch-delete', deletedBy = null } = {}
) => {
  const studentRows = students.filter(student => student?.admissionNumber);
  const admissionNumbers = [...new Set(studentRows.map(student => student.admissionNumber))];

  if (admissionNumbers.length === 0) {
    return { archivedCount: 0 };
  }

  await cleanupExpiredStudentCredentialArchives(tx);

  const accounts = await tx.studentPortalAccount.findMany({
    where: {
      admissionNumber: { in: admissionNumbers }
    }
  });

  const studentMap = new Map(studentRows.map(student => [student.admissionNumber, student]));
  const accountsWithPasswords = accounts.filter(account => account?.passwordHash);

  for (const account of accountsWithPasswords) {
    const student = studentMap.get(account.admissionNumber) || {};
    const now = new Date();

    await tx.archivedStudentPortalCredential.upsert({
      where: { admissionNumber: account.admissionNumber },
      update: {
        passwordHash: account.passwordHash,
        originalStudentId: student.id || null,
        originalPortalAccountId: account.id,
        sourceBatchId,
        archiveReason,
        deletedBy,
        firstName: account.firstName || student.firstName || null,
        middleName: account.middleName || student.middleName || null,
        lastName: account.lastName || student.lastName || null,
        fullName: account.fullName || buildStudentFullName(student) || null,
        form: account.form || student.form || null,
        stream: account.stream || student.stream || null,
        email: account.email || student.email || null,
        parentPhone: account.parentPhone || student.parentPhone || null,
        status: 'archived',
        passwordSetAt: account.passwordSetAt || null,
        lastLoginAt: account.lastLoginAt || null,
        archivedAt: now,
        restoredAt: null,
        expiresAt: getArchiveExpiryDate()
      },
      create: {
        admissionNumber: account.admissionNumber,
        passwordHash: account.passwordHash,
        originalStudentId: student.id || null,
        originalPortalAccountId: account.id,
        sourceBatchId,
        archiveReason,
        deletedBy,
        firstName: account.firstName || student.firstName || null,
        middleName: account.middleName || student.middleName || null,
        lastName: account.lastName || student.lastName || null,
        fullName: account.fullName || buildStudentFullName(student) || null,
        form: account.form || student.form || null,
        stream: account.stream || student.stream || null,
        email: account.email || student.email || null,
        parentPhone: account.parentPhone || student.parentPhone || null,
        status: 'archived',
        passwordSetAt: account.passwordSetAt || null,
        lastLoginAt: account.lastLoginAt || null,
        archivedAt: now,
        expiresAt: getArchiveExpiryDate()
      }
    });
  }

  return { archivedCount: accountsWithPasswords.length };
};

const restoreStudentPortalCredentials = async (tx, studentRows = []) => {
  const admissionNumbers = [...new Set(
    studentRows
      .map(student => student?.admissionNumber)
      .filter(Boolean)
  )];

  if (admissionNumbers.length === 0) {
    return { restoredCount: 0 };
  }

  await cleanupExpiredStudentCredentialArchives(tx);

  const [archives, activeStudents, existingAccounts] = await Promise.all([
    tx.archivedStudentPortalCredential.findMany({
      where: {
        admissionNumber: { in: admissionNumbers },
        expiresAt: { gt: new Date() }
      }
    }),
    tx.databaseStudent.findMany({
      where: {
        admissionNumber: { in: admissionNumbers },
        status: 'active'
      }
    }),
    tx.studentPortalAccount.findMany({
      where: {
        admissionNumber: { in: admissionNumbers }
      },
      select: {
        admissionNumber: true,
        passwordHash: true
      }
    })
  ]);

  const activeStudentMap = new Map(activeStudents.map(student => [student.admissionNumber, student]));
  const existingAccountMap = new Map(existingAccounts.map(account => [account.admissionNumber, account]));
  let restoredCount = 0;

  for (const archive of archives) {
    const student = activeStudentMap.get(archive.admissionNumber);
    if (!student || !archive.passwordHash) continue;

    const snapshot = {
      firstName: student.firstName || archive.firstName || null,
      middleName: student.middleName || archive.middleName || null,
      lastName: student.lastName || archive.lastName || null,
      fullName: buildStudentFullName(student) || archive.fullName || null,
      form: student.form || archive.form || null,
      stream: student.stream || archive.stream || null,
      email: student.email || archive.email || null,
      parentPhone: student.parentPhone || archive.parentPhone || null,
      status: 'active'
    };

    const existingAccount = existingAccountMap.get(archive.admissionNumber);

    await tx.studentPortalAccount.upsert({
      where: { admissionNumber: archive.admissionNumber },
      update: {
        ...(existingAccount?.passwordHash ? {} : { passwordHash: archive.passwordHash }),
        ...snapshot,
        passwordSetAt: archive.passwordSetAt || undefined
      },
      create: {
        admissionNumber: archive.admissionNumber,
        passwordHash: archive.passwordHash,
        ...snapshot,
        passwordSetAt: archive.passwordSetAt || new Date(),
        lastLoginAt: archive.lastLoginAt || null
      }
    });

    await tx.archivedStudentPortalCredential.update({
      where: { admissionNumber: archive.admissionNumber },
      data: {
        restoredAt: new Date(),
        status: 'restored'
      }
    });

    restoredCount++;
  }

  return { restoredCount };
};

const normalizeStudentUploadFailure = (error) => {
  const message = String(error?.message || '').trim();
  const lowerMessage = message.toLowerCase();

  if (error?.code === 'P2002' || lowerMessage.includes('unique constraint')) {
    return 'Duplicate student records were found. Please review the duplicate list and make sure each admission number appears only once.';
  }

  if (error?.code === 'P2003' || lowerMessage.includes('foreign key constraint')) {
    return 'Some uploaded rows reference records that no longer exist. Refresh the page and retry the upload.';
  }

  if (error?.code === 'P2024' || lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return 'Student upload took longer than expected. Please retry the file, keep this page open, and avoid refreshing while it saves.';
  }

  if (lowerMessage.includes('network') || lowerMessage.includes('fetch failed') || lowerMessage.includes('aborted') || lowerMessage.includes('interrupted')) {
    return 'Student upload was interrupted before saving finished. Check your connection, keep the page open, and try again.';
  }

  if (lowerMessage.includes('csv parsing failed')) {
    return 'The CSV file could not be read. Confirm it uses the current student template and has a header row.';
  }

  if (lowerMessage.includes('excel parsing failed')) {
    return 'The Excel file could not be read. Confirm the first sheet uses the current student template and is not protected or empty.';
  }

  if (lowerMessage.includes('pdf parsing failed')) {
    return 'The PDF file could not be read. Confirm it is text-based and includes admission number, student name, class or grade, and phone columns.';
  }

  if (lowerMessage.includes('no readable student rows') || lowerMessage.includes('empty')) {
    return 'No readable student rows were found. Confirm the sheet is not empty and the headers match the student template.';
  }

  return message || 'Student upload failed. Please try again.';
};

// Helper to parse dates consistently
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  const str = String(dateStr).trim();
  
  // Reject extended year formats
  if (str.match(/^[+-]\d{6}/)) return null;
  
  // Try Excel serial number
  if (!isNaN(str) && Number(str) > 0) {
    const excelDate = Number(str);
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      if (year >= 1900 && year <= new Date().getFullYear() + 5) {
        return date;
      }
    }
  }
  
  // Try ISO string
  let date = new Date(str);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    if (year >= 1900 && year <= new Date().getFullYear() + 5) {
      return date;
    }
  }
  
  // Try common formats
  const formats = [
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
  ];
  
  for (const format of formats) {
    const match = str.match(format);
    if (match) {
      let year, month, day;
      
      if (match[1].length === 4) {
        // YYYY-MM-DD or YYYY/MM/DD
        year = parseInt(match[1]);
        month = parseInt(match[2]) - 1;
        day = parseInt(match[3]);
      } else {
        // DD/MM/YYYY or MM/DD/YYYY
        const part1 = parseInt(match[1]);
        const part2 = parseInt(match[2]);
        const part3 = parseInt(match[3]);
        
        if (part3 > 31) {
          // DD/MM/YYYY or MM/DD/YYYY with 4-digit year
          if (part1 > 12) {
            // DD/MM/YYYY
            day = part1;
            month = part2 - 1;
            year = part3;
          } else {
            // MM/DD/YYYY
            month = part1 - 1;
            day = part2;
            year = part3;
          }
        } else {
          // Ambiguous, assume DD/MM/YYYY
          day = part1;
          month = part2 - 1;
          year = part3 < 100 ? 2000 + part3 : part3;
        }
      }
      
      if (year && month >= 0 && day) {
        date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          const finalYear = date.getFullYear();
          if (finalYear >= 1900 && finalYear <= new Date().getFullYear() + 5) {
            return date;
          }
        }
      }
    }
  }
  
  return null;
};

// Build WHERE clause from query parameters
const buildWhereClause = (params) => {
  const { form, stream, gender, status, search, uploadedCategory, className } = params;
  const where = {};
  
  if (form && form !== 'all') where.form = form;
  if (stream && stream !== 'all') where.stream = stream;
  if (gender && gender !== 'all') where.gender = gender;
  if (className && className !== 'all') where.className = className;
  if (uploadedCategory && uploadedCategory !== 'all') where.uploadedCategory = uploadedCategory;
  if (status && status !== 'all') where.status = status;
  
  if (search && search.trim()) {
    const searchTerm = search.trim();
    const searchTokens = searchTerm
      .split(/\s+/)
      .map(token => token.trim())
      .filter(Boolean);
    
    where.OR = [
      { admissionNumber: { contains: searchTerm } },
      { firstName: { contains: searchTerm } },
      { middleName: { contains: searchTerm } },
      { lastName: { contains: searchTerm } },
      { fullName: { contains: searchTerm } },
      { email: { contains: searchTerm } },
      { parentPhone: { contains: searchTerm } },
      { studentPhone: { contains: searchTerm } },
      { whatsappPhone: { contains: searchTerm } },
      { form: { contains: searchTerm } },
      { gradeLevel: { contains: searchTerm } },
      { className: { contains: searchTerm } },
      { stream: { contains: searchTerm } },
      { uploadedCategory: { contains: searchTerm } },
      ...(searchTokens.length > 1
        ? [{
            AND: searchTokens.map(token => ({
              OR: [
                { firstName: { contains: token } },
                { middleName: { contains: token } },
                { lastName: { contains: token } },
                { fullName: { contains: token } },
                { admissionNumber: { contains: token } },
                { email: { contains: token } },
                { parentPhone: { contains: token } },
                { studentPhone: { contains: token } },
                { whatsappPhone: { contains: token } },
                { className: { contains: token } }
              ]
            }))
          }]
        : [])
    ];
  }
  
  return where;
};

// Calculate statistics from WHERE clause
const calculateStatistics = async (whereClause = {}) => {
  try {
    // Get form distribution
    const formStats = await prisma.databaseStudent.groupBy({
      by: ['form'],
      where: whereClause,
      _count: { id: true }
    });

    // Get total count
    const totalStudents = await prisma.databaseStudent.count({
      where: whereClause
    });

    // Convert to structured format
    const formStatsObj = formStats.reduce((acc, stat) => ({
      ...acc,
      [stat.form]: stat._count.id
    }), {});

    const stats = {
      totalStudents,
      form1: formStatsObj['Form 1'] || 0,
      form2: formStatsObj['Form 2'] || 0,
      form3: formStatsObj['Form 3'] || 0,
      form4: formStatsObj['Form 4'] || 0,
      grade10: formStatsObj['Grade 10'] || 0,
      grade11: formStatsObj['Grade 11'] || 0,
      grade12: formStatsObj['Grade 12'] || 0,
      updatedAt: new Date()
    };

    // Validate consistency
    const formSum = stats.form1 + stats.form2 + stats.form3 + stats.form4 + stats.grade10 + stats.grade11 + stats.grade12;
    const isValid = formSum === totalStudents;

    return {
      stats,
      validation: {
        isValid,
        totalStudents,
        sumOfForms: formSum,
        difference: totalStudents - formSum,
        hasDiscrepancy: !isValid
      }
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    throw error;
  }
};

// Update cached statistics
const updateCachedStats = async (stats) => {
  try {
    await prisma.studentStats.upsert({
      where: { id: 'global_stats' },
      update: {
        totalStudents: stats.totalStudents,
        form1: stats.form1,
        form2: stats.form2,
        form3: stats.form3,
        form4: stats.form4,
        grade10: stats.grade10 || 0,
        grade11: stats.grade11 || 0,
        grade12: stats.grade12 || 0,
        updatedAt: new Date()
      },
      create: {
        id: 'global_stats',
        ...stats
      }
    });
  } catch (error) {
    console.error('Error updating cached stats:', error);
  }
};

// ========== UPLOAD STRATEGY FUNCTIONS ==========

// Validate and normalize form selection
const validateFormSelection = (forms) => {
  if (!forms || forms.length === 0) {
    throw new Error('Please select at least one form to upload');
  }
  
  const validForms = VALID_STUDENT_LEVELS;
  const normalizedForms = [];
  
  forms.forEach(form => {
    const normalized = normalizeAcademicLevel(form);
    if (validForms.includes(normalized)) {
      normalizedForms.push(normalized);
    }
  });
  
  if (normalizedForms.length === 0) {
    throw new Error(`Please select valid classes (${validForms.join(', ')})`);
  }
  
  return normalizedForms;
};

// Check for duplicate admission numbers
const checkDuplicateAdmissionNumbers = async (students, targetForm = null) => {
  const admissionNumbers = students
    .map(s => String(s.admissionNumber || '').trim())
    .filter(Boolean);
  const seenInFile = new Map();
  const fileDuplicates = [];

  students.forEach((student, index) => {
    const admissionNumber = String(student.admissionNumber || '').trim();
    if (!admissionNumber) return;

    if (seenInFile.has(admissionNumber)) {
      fileDuplicates.push({
        row: getSourceRowNumber(student, index),
        admissionNumber,
        name: buildStudentFullName(student) || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
        form: student.form,
        duplicateType: 'file',
        message: `Admission number also appears on row ${seenInFile.get(admissionNumber)} in this file`
      });
      return;
    }

    seenInFile.set(admissionNumber, getSourceRowNumber(student, index));
  });
  
  const whereClause = {
    admissionNumber: { in: admissionNumbers }
  };
  
  if (targetForm) {
    whereClause.form = targetForm;
  }
  
  const existingStudents = await prisma.databaseStudent.findMany({
    where: whereClause,
    select: {
      admissionNumber: true,
      firstName: true,
      lastName: true,
      form: true
    }
  });
  
  const duplicates = students
    .map((student, index) => {
      const existing = existingStudents.find(s => s.admissionNumber === student.admissionNumber);
      if (existing) {
        return {
          row: getSourceRowNumber(student, index),
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          form: student.form,
          existingName: `${existing.firstName} ${existing.lastName}`,
          existingForm: existing.form,
          duplicateType: 'database'
        };
      }
      return null;
    })
    .filter(dup => dup !== null);
  
  return [...fileDuplicates, ...duplicates];
};

// Process New Upload
const processNewUpload = async (students, uploadBatchId, selectedForms, duplicateAction = 'skip', tx = prisma) => {
  const stats = {
    totalRows: students.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    createdStudents: [],
    restoredAccounts: 0
  };
  
  // Get existing admission numbers across all forms
  const existingAdmissionNumbers = new Set();
  const existingStudents = await tx.databaseStudent.findMany({
    where: {
      admissionNumber: { 
        in: students.map(s => s.admissionNumber).filter(Boolean) 
      }
    },
    select: {
      admissionNumber: true,
      form: true
    }
  });
  
  existingStudents.forEach(s => existingAdmissionNumbers.add(s.admissionNumber));
  
  const studentsToCreate = [];
  const seenAdmissionNumbers = new Set();
  
  for (const [index, student] of students.entries()) {
    const validation = validateStudent(student, index);
    const rowNumber = getSourceRowNumber(student, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }

    if (!selectedForms.includes(student.form)) {
      stats.errorRows++;
      stats.errors.push(`Row ${rowNumber}: Form ${student.form} is not in the selected upload forms (${selectedForms.join(', ')}).`);
      continue;
    }
    
    const admissionNumber = student.admissionNumber;
    
    // Check duplicates within the file
    if (seenAdmissionNumbers.has(admissionNumber)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${rowNumber}: Duplicate admission number in file: ${admissionNumber}`);
      continue;
    }
    seenAdmissionNumbers.add(admissionNumber);
    
    // Check if admission number already exists in database
    if (existingAdmissionNumbers.has(admissionNumber)) {
      if (duplicateAction === 'skip') {
        stats.skippedRows++;
        stats.errors.push(`Row ${rowNumber}: Skipped - admission number already exists: ${admissionNumber}`);
        continue;
      } else if (duplicateAction === 'replace') {
        // For replace action, we need to update existing student
        try {
          const updatedStudent = await tx.databaseStudent.updateMany({
            where: {
              admissionNumber: admissionNumber,
              form: student.form
            },
            data: {
              ...buildStudentPersistenceData(student, uploadBatchId),
              updatedAt: new Date()
            }
          });
          
          if (updatedStudent.count === 0) {
            // Student exists but in different form - skip
            stats.skippedRows++;
            stats.errors.push(`Row ${rowNumber}: Cannot replace - student exists in different form. Use Update Upload for specific forms.`);
            continue;
          }
          
          stats.validRows++;
          continue;
        } catch (error) {
          stats.skippedRows++;
          stats.errors.push(`Row ${rowNumber}: Failed to replace student ${admissionNumber}: ${error.message}`);
          continue;
        }
      }
    }
    
    // Add to create list
    studentsToCreate.push(buildStudentPersistenceData(student, uploadBatchId));
    
    stats.validRows++;
  }
  
  // Insert students
  if (studentsToCreate.length > 0) {
    try {
      await createManyInChunks(tx.databaseStudent, studentsToCreate, {
        skipDuplicates: false // We handle duplicates manually
      });
      
      stats.createdStudents = studentsToCreate;
      const restoreResult = await restoreStudentPortalCredentials(tx, studentsToCreate);
      stats.restoredAccounts += restoreResult.restoredCount;
    } catch (error) {
      console.error('Error creating students:', error);
      throw new Error(`Failed to save ${studentsToCreate.length} student record(s): ${error.message}`);
    }
  }
  
  return stats;
};

// Process Update Upload
const processUpdateUpload = async (students, uploadBatchId, targetForm, tx = prisma) => {
  const stats = {
    totalRows: students.length,
    validRows: 0,
    updatedRows: 0,
    createdRows: 0,
    deactivatedRows: 0,
    errorRows: 0,
    errors: [],
    updatedStudents: [],
    createdStudents: [],
    restoredAccounts: 0
  };
  
  // Get existing students in this form
  const existingStudents = await tx.databaseStudent.findMany({
    where: {
      form: targetForm,
      status: 'active'
    },
    select: {
      id: true,
      admissionNumber: true,
      uploadBatchId: true
    }
  });
  
  const existingAdmissionMap = new Map(
    existingStudents.map(s => [s.admissionNumber, { 
      id: s.id, 
      uploadBatchId: s.uploadBatchId 
    }])
  );
  
  const seenAdmissionNumbers = new Set();
  const admissionNumbersInNewUpload = new Set();
  let matchedTargetRows = 0;
  const studentsToCreate = [];
  
  // Process each student in the upload
  for (const [index, student] of students.entries()) {
    const validation = validateStudent(student, index);
    const rowNumber = getSourceRowNumber(student, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }

    if (student.form !== targetForm) {
      stats.errorRows++;
      stats.errors.push(`Row ${rowNumber}: Form must match the selected update form (${targetForm}). Found ${student.form}.`);
      continue;
    }

    matchedTargetRows++;
    
    const admissionNumber = student.admissionNumber;
    
    // Check duplicates within the file
    if (seenAdmissionNumbers.has(admissionNumber)) {
      stats.errorRows++;
      stats.errors.push(`Row ${rowNumber}: Duplicate admission number in file: ${admissionNumber}`);
      continue;
    }
    seenAdmissionNumbers.add(admissionNumber);
    admissionNumbersInNewUpload.add(admissionNumber);
    
    // Check if student exists in this form
    const existingStudent = existingAdmissionMap.get(admissionNumber);
    
    if (existingStudent) {
      // Update existing student
      try {
        const updatedStudent = await tx.databaseStudent.update({
          where: { id: existingStudent.id },
          data: {
            ...buildStudentPersistenceData(student, uploadBatchId, targetForm),
            updatedAt: new Date()
          }
        });
        
        stats.updatedRows++;
        stats.updatedStudents.push(updatedStudent);
      } catch (error) {
        stats.errorRows++;
        stats.errors.push(`Row ${rowNumber}: Failed to update student ${admissionNumber}: ${error.message}`);
        continue;
      }
    } else {
      studentsToCreate.push(buildStudentPersistenceData(student, uploadBatchId, targetForm));
    }
    
    stats.validRows++;
  }

  if (matchedTargetRows === 0) {
    throw new Error(`No students found for form ${targetForm}. Make sure the form column matches the selected form.`);
  }

  if (studentsToCreate.length > 0) {
    try {
      await createManyInChunks(tx.databaseStudent, studentsToCreate, {
        skipDuplicates: false
      });
      stats.createdRows += studentsToCreate.length;
      stats.createdStudents = studentsToCreate;
      const restoreResult = await restoreStudentPortalCredentials(tx, studentsToCreate);
      stats.restoredAccounts += restoreResult.restoredCount;
    } catch (error) {
      throw new Error(`Failed to save ${studentsToCreate.length} student record(s): ${error.message}`);
    }
  }
  
  // Deactivate students in this form that are not in the new upload
  const studentsToDeactivate = existingStudents.filter(s => 
    !admissionNumbersInNewUpload.has(s.admissionNumber)
  );
  
  if (studentsToDeactivate.length > 0) {
    await tx.databaseStudent.updateMany({
      where: {
        id: { in: studentsToDeactivate.map(s => s.id) }
      },
      data: {
        status: 'inactive',
        updatedAt: new Date()
      }
    });
    
    stats.deactivatedRows = studentsToDeactivate.length;
  }
  
  return stats;
};

// ========== CSV PARSING ==========
const mapStudentUploadHeader = (header = '') => {
  const normalized = normalizeColumnKey(header);
  const loose = normalizeLooseKey(header);

  if (normalized.includes('admission') || normalized.includes('admno') || normalized === 'adm') {
    return 'admissionNumber';
  }
  if (normalized.includes('firstname') || normalized === 'first') {
    return 'firstName';
  }
  if (normalized.includes('middlename') || normalized === 'middle') {
    return 'middleName';
  }
  if (normalized.includes('lastname') || normalized.includes('surname') || normalized === 'last') {
    return 'lastName';
  }
  if (normalized.includes('fullname') || normalized.includes('studentname') || normalized.includes('learnername') || normalized === 'name') {
    return 'fullName';
  }
  if (normalized.includes('classname') || normalized === 'class' || normalized.includes('classinfo')) {
    return 'className';
  }
  if (normalized.includes('form')) {
    return 'form';
  }
  if (normalized.includes('grade') || normalized.includes('level')) {
    return 'gradeLevel';
  }
  if (normalized.includes('stream')) {
    return 'stream';
  }
  if (normalized.includes('whatsapp') || normalized.includes('mobilemoney')) {
    return 'whatsappPhone';
  }
  if (normalized.includes('studentphone') || normalized.includes('learnerphone') || loose === 'phone') {
    return 'studentPhone';
  }
  if (normalized.includes('parentphone') || normalized.includes('guardianphone') || normalized.includes('contactphone') || normalized.includes('phone') || normalized.includes('mobile')) {
    return 'parentPhone';
  }
  if (normalized.includes('email')) {
    return 'email';
  }
  if (normalized.includes('category') || normalized.includes('cohort') || normalized.includes('group')) {
    return 'uploadedCategory';
  }

  return normalized;
};

const hasRequiredStudentHeaders = (headers = []) => {
  const hasAdmission = headers.includes('admissionNumber');
  const hasName = headers.includes('fullName') || (headers.includes('firstName') && headers.includes('lastName'));
  const hasClassInfo = headers.includes('form') || headers.includes('gradeLevel') || headers.includes('className');

  return {
    isValid: hasAdmission && hasName && hasClassInfo,
    missingColumns: [
      !hasAdmission ? 'admissionNumber' : null,
      !hasName ? 'student name (fullName or firstName + lastName)' : null,
      !hasClassInfo ? 'class information (grade, form, or className)' : null
    ].filter(Boolean)
  };
};

const normalizeStudentUploadRow = (row = {}, index = 0) => {
  const admissionNumber = String(row.admissionNumber || '').trim();
  const fullNameInput = String(row.fullName || row.name || '').trim();
  const splitName = splitStudentName(fullNameInput);
  const firstName = String(row.firstName || splitName.firstName || '').trim();
  const middleName = String(row.middleName || splitName.middleName || '').trim() || null;
  const lastName = String(row.lastName || splitName.lastName || '').trim();
  const rawClassName = String(row.className || '').trim();
  const rawForm = String(row.form || row.gradeLevel || rawClassName || '').trim();
  const form = extractAcademicLevel(row.form, row.gradeLevel, rawClassName);
  const stream = String(row.stream || '').trim() || null;
  const className = buildClassName(form, stream, rawClassName);
  const parentPhone = normalizeLocalMobilePhone(row.parentPhone || row.phone || row.whatsappPhone || '');
  const studentPhone = normalizeLocalMobilePhone(row.studentPhone || '');
  const whatsappPhone = normalizeLocalMobilePhone(row.whatsappPhone || parentPhone || studentPhone || '');
  const email = row.email ? String(row.email).trim() : null;
  const uploadedCategory = String(row.uploadedCategory || row.category || form || '').trim() || null;
  const fullName = buildStudentFullName({ fullName: fullNameInput, firstName, middleName, lastName });

  const hasAnyContent = [
    admissionNumber,
    fullName,
    firstName,
    middleName,
    lastName,
    rawForm,
    rawClassName,
    stream,
    parentPhone,
    studentPhone,
    whatsappPhone,
    email,
    uploadedCategory
  ].some(Boolean);

  if (!hasAnyContent) return null;

  return {
    sourceRowNumber: index + 2,
    admissionNumber,
    firstName,
    middleName,
    lastName,
    fullName,
    form,
    gradeLevel: form,
    className,
    stream,
    parentPhone,
    studentPhone,
    whatsappPhone,
    email,
    uploadedCategory,
    status: String(row.status || 'active').trim() || 'active'
  };
};

const buildStudentPersistenceData = (student, uploadBatchId, formOverride = null) => {
  const form = formOverride || student.form;
  const fullName = buildStudentFullName({ ...student, form });
  const className = buildClassName(form, student.stream, student.className);
  const parentPhone = normalizeLocalMobilePhone(student.parentPhone || student.whatsappPhone || student.studentPhone || '');
  const studentPhone = normalizeLocalMobilePhone(student.studentPhone || '');
  const whatsappPhone = normalizeLocalMobilePhone(student.whatsappPhone || parentPhone || studentPhone || '');

  return {
    admissionNumber: student.admissionNumber,
    firstName: student.firstName,
    middleName: student.middleName || null,
    lastName: student.lastName,
    fullName,
    form,
    gradeLevel: student.gradeLevel || form,
    className,
    stream: student.stream || null,
    parentPhone,
    studentPhone,
    whatsappPhone,
    email: student.email || null,
    uploadedCategory: student.uploadedCategory || form,
    dateOfBirth: null,
    gender: null,
    address: null,
    uploadBatchId,
    status: 'active'
  };
};

const parseStudentRowsFromPlainText = (text = '') => {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return lines
    .map((line, index) => {
      if (/admission|adm\s*no|student\s*name|parent\s*phone/i.test(line) && index < 5) return null;

      const admissionMatch = line.match(/\b\d{4,10}\b/);
      const phoneMatches = line.match(/(?:\+?254|0)?7\d{8}\b/g) || [];
      const emailMatch = line.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
      const level = extractAcademicLevel(line);

      if (!admissionMatch || !level) return null;

      let nameText = line
        .replace(admissionMatch[0], ' ')
        .replace(emailMatch?.[0] || '', ' ')
        .replace(/\b(?:grade\s*1[0-2]|g\s*1[0-2]|form\s*[1-4]|f\s*[1-4])\b/ig, ' ')
        .replace(/(?:\+?254|0)?7\d{8}\b/g, ' ')
        .replace(/[|,;:\t]+/g, ' ')
        .replace(/\b(admission|adm|no|student|name|parent|phone|class|grade|form|stream)\b/ig, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return normalizeStudentUploadRow({
        admissionNumber: admissionMatch[0],
        fullName: nameText,
        form: level,
        className: level,
        parentPhone: phoneMatches[0] || '',
        whatsappPhone: phoneMatches[0] || '',
        studentPhone: phoneMatches[1] || '',
        email: emailMatch?.[0] || ''
      }, index);
    })
    .filter(Boolean);
};

const extractPDFText = async (file) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (!globalThis.DOMMatrix) globalThis.DOMMatrix = class DOMMatrix {};
    if (!globalThis.ImageData) globalThis.ImageData = class ImageData {};
    if (!globalThis.Path2D) globalThis.Path2D = class Path2D {};

    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result?.text || '';
  } catch (error) {
    console.warn('PDF text extraction library failed, falling back to raw text scan:', error?.message || error);
    return buffer
      .toString('latin1')
      .replace(/\\r/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, ' ');
  }
};

const parsePDF = async (file) => {
  try {
    const text = await extractPDFText(file);
    const data = parseStudentRowsFromPlainText(text);

    if (data.length === 0) {
      throw new Error('No readable student rows were found in the PDF. Use a text-based PDF with admission number, student name, class/grade, and phone columns.');
    }

    return data;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

const parseCSV = async (file) => {
  try {
    const text = await file.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('CSV file is empty');
    }
    
    console.log(`📄 CSV content size: ${text.length} bytes, preview: ${text.substring(0, 100)}`);
    
    const delimiters = ['\t', ',', ';'];
    let lastError = null;
    
    for (const delimiter of delimiters) {
      try {
        return await new Promise((resolve, reject) => {
          parse(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            delimiter,
            transformHeader: mapStudentUploadHeader,
            complete: (results) => {
              try {
                const headers = results.meta.fields || [];
                console.log(`✅ CSV parsed with delimiter "${delimiter}":`, headers.length, 'columns');
                
                if (headers.length === 0) {
                  reject(new Error('No headers found in CSV file'));
                  return;
                }
                
                const headerValidation = hasRequiredStudentHeaders(headers);
                if (!headerValidation.isValid) {
                  reject(new Error(`Missing required columns: ${headerValidation.missingColumns.join(', ')}`));
                  return;
                }
                
                const data = results.data
                  .map((row, index) => {
                    // Skip empty rows
                    if (!row || Object.keys(row).every(k => !row[k])) {
                      return null;
                    }
                    return normalizeStudentUploadRow(row, index);
                  })
                  .filter(item => item !== null);
                
                console.log(`✅ CSV validation complete: ${data.length} valid rows from ${results.data.length} total`);
                
                if (data.length === 0) {
                  reject(new Error('No valid student records found after processing. Verify data format and required fields.'));
                  return;
                }
                
                resolve(data);
              } catch (processError) {
                reject(processError);
              }
            },
            error: (parseError) => {
              console.warn(`⚠️ CSV parsing error with delimiter "${delimiter}":`, parseError.message);
              reject(parseError);
            }
          });
        });
      } catch (delimiterError) {
        lastError = delimiterError;
        console.log(`⚠️ Delimiter "${delimiter}" failed, trying next...`);
        continue;
      }
    }
    
    // All delimiters failed
    throw new Error(`Could not parse CSV with any delimiter. Last error: ${lastError?.message || 'Unknown'}. Please verify file format has headers: admission#, name, class/grade.`);
    
  } catch (error) {
    console.error('❌ CSV parsing error:', error.message);
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
};

// ========== EXCEL PARSING - SIMPLIFIED VERSION ==========
const parseExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    
    // Read workbook with extended options for better compatibility
    const workbook = XLSX.read(buffer, { 
      type: 'buffer', 
      cellDates: true,
      cellFormula: false,
      cellHTML: false,
      cellNF: false
    });
    
    // Find a sheet with actual data (skip empty sheets)
    let sheetName = null;
    for (const name of workbook.SheetNames) {
      const sheet = workbook.Sheets[name];
      if (sheet && Object.keys(sheet).length > 1) {
        sheetName = name;
        break;
      }
    }
    
    if (!sheetName) {
      throw new Error('No data found in any worksheet');
    }
    
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with robust options
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: false,
      dateNF: 'yyyy-mm-dd',
      blankrows: false
    });
    
    console.log(`✅ Excel parsed: ${jsonData.length} rows from sheet "${sheetName}"`);
    
    if (jsonData.length === 0) {
      throw new Error('No data rows found in Excel file. Please ensure the sheet contains data below the headers.');
    }
    
    // Validate that headers exist
    if (jsonData[0] && Object.keys(jsonData[0]).length === 0) {
      throw new Error('Excel file has no headers. Please add column headers in the first row.');
    }
    
    // Log the exact structure for debugging
    const headerKeys = jsonData[0] ? Object.keys(jsonData[0]) : [];
    console.log(`📋 Headers found (${headerKeys.length}):`, headerKeys.slice(0, 5).join(', '), headerKeys.length > 5 ? '...' : '');
    
    const normalizeHeaders = (row) => {
      const normalized = {};
      Object.entries(row || {}).forEach(([key, value]) => {
        const mappedKey = mapStudentUploadHeader(key);
        if (value !== undefined && value !== null && value !== '') {
          normalized[mappedKey] = value;
        }
      });
      return normalized;
    };

    const data = jsonData
      .map((row, index) => {
        try {
          // Skip empty rows
          if (!row || Object.keys(row).every(k => !row[k])) {
            return null;
          }
          
          const normalizedRow = normalizeHeaders(row);
          const student = normalizeStudentUploadRow(normalizedRow, index);
          
          if (index < 2) {
            console.log(`📝 Row ${index + 1} mapped:`, {
              admission: student.admissionNumber,
              name: student.firstName + ' ' + student.lastName,
              form: student.form
            });
          }
          
          return student;
        } catch (error) {
          console.warn(`⚠️ Warning: Could not parse row ${index + 2}: ${error.message}`);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`✅ Excel validation complete: ${data.length} valid rows out of ${jsonData.length}`);
    
    if (data.length === 0) {
      throw new Error('No valid student records found. Check that required fields (admission#, name, class/grade) are present and properly formatted.');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Excel parsing error:', error.message);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== VALIDATION ==========
const validateStudent = (student, index) => {
  const errors = [];
  const rowNumber = getSourceRowNumber(student, index);
  
  // Admission number
  if (!student.admissionNumber) {
    errors.push(`Row ${rowNumber}: Admission number is required`);
  } else if (!/^\d{4,10}$/.test(student.admissionNumber)) {
    errors.push(`Row ${rowNumber}: Admission number must be 4-10 digits (got: ${student.admissionNumber})`);
  }
  
  // Names
  if (!student.firstName) {
    errors.push(`Row ${rowNumber}: First name is required`);
  } else if (student.firstName.length > 100) {
    errors.push(`Row ${rowNumber}: First name too long (max 100 chars)`);
  }
  
  if (!student.lastName) {
    errors.push(`Row ${rowNumber}: Last name is required`);
  } else if (student.lastName.length > 100) {
    errors.push(`Row ${rowNumber}: Last name too long (max 100 chars)`);
  }
  
  // Form validation
  const formValue = String(student.form || '').trim();
  const validForms = VALID_STUDENT_LEVELS;
  
  if (!validForms.includes(formValue)) {
    errors.push(`Row ${rowNumber}: Class/grade must be one of: ${validForms.join(', ')} (got: ${formValue || 'blank'})`);
  }
  
  // Update student with normalized form
  student.form = formValue;
  
  // Optional fields
  if (student.middleName && student.middleName.length > 100) {
    errors.push(`Row ${rowNumber}: Middle name too long (max 100 chars)`);
  }

  if (student.fullName && student.fullName.length > 255) {
    errors.push(`Row ${rowNumber}: Student full name too long (max 255 chars)`);
  }
  
  if (student.stream && student.stream.length > 50) {
    errors.push(`Row ${rowNumber}: Stream too long (max 50 chars)`);
  }
  
  const contactPhones = [
    ['Parent phone', student.parentPhone],
    ['Student phone', student.studentPhone],
    ['WhatsApp phone', student.whatsappPhone]
  ].filter(([, value]) => value);

  for (const [label, value] of contactPhones) {
    if (!isLocalMobilePhone(value)) {
      errors.push(`Row ${rowNumber}: ${label} must be in 07XXXXXXXX format`);
    }
  }
  
  if (student.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      errors.push(`Row ${rowNumber}: Email is invalid`);
    } else if (student.email.length > 100) {
      errors.push(`Row ${rowNumber}: Email too long (max 100 chars)`);
    }
  }
  
  if (student.className && student.className.length > 100) {
    errors.push(`Row ${rowNumber}: Class information too long (max 100 chars)`);
  }

  if (student.uploadedCategory && student.uploadedCategory.length > 100) {
    errors.push(`Row ${rowNumber}: Uploaded category too long (max 100 chars)`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// ========== API ENDPOINTS ==========

// GET - Main endpoint with consistent statistics (PUBLIC - no authentication required)
export async function GET(request) {
  let startTime = Date.now();
  
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const form = url.searchParams.get('form') || '';
    const stream = url.searchParams.get('stream') || '';
    const gender = url.searchParams.get('gender') || '';
    const className = url.searchParams.get('className') || '';
    const uploadedCategory = url.searchParams.get('uploadedCategory') || '';
    const status = url.searchParams.get('status') || 'active';
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    
    // Validate and sanitize pagination parameters
    let page = parseInt(url.searchParams.get('page') || '1');
    let limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Prevent invalid pagination values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 500) limit = 500; // Max limit to prevent data dump
    
    const includeStats = url.searchParams.get('includeStats') !== 'false';

    // Validate sortBy to prevent injection
    const allowedSortFields = ['createdAt', 'updatedAt', 'admissionNumber', 'firstName', 'lastName', 'form', 'className'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    // Build filters
    const filters = { form, stream, gender, className, uploadedCategory, status, search };
    const where = buildWhereClause(filters);

    if (action === 'uploads') {
      try {
        const uploads = await prisma.studentBulkUpload.findMany({
          orderBy: { uploadDate: 'desc' },
          skip: Math.max(0, (page - 1) * limit),
          take: limit,
          select: {
            id: true,
            fileName: true,
            fileType: true,
            status: true,
            uploadDate: true,
            uploadedBy: true,
            processedDate: true,
            totalRows: true,
            validRows: true,
            skippedRows: true,
            errorRows: true,
            errorLog: true
          }
        });

        const total = await prisma.studentBulkUpload.count();
        
        console.log(`✅ Fetched ${uploads.length} upload records in ${Date.now() - startTime}ms`);
        
        return NextResponse.json({
          success: true,
          uploads: uploads || [],
          pagination: { 
            page, 
            limit, 
            total, 
            pages: Math.ceil(total / limit) 
          }
        });
      } catch (dbError) {
        console.error('❌ Database error fetching uploads:', dbError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to fetch upload records',
            message: process.env.NODE_ENV === 'development' ? dbError.message : 'Database error'
          },
          { status: 500 }
        );
      }
    }
    if (action === 'contacts') {
      try {
        const parseQueryList = (key) =>
          (url.searchParams.get(key) || '')
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);

        const criteria = {
          channel: 'whatsapp',
          senderReference: SCHOOL_COMMUNICATION_NUMBER,
          grades: parseQueryList('grades').map(normalizeAcademicLevel).filter(Boolean),
          classes: parseQueryList('classes'),
          categories: parseQueryList('categories'),
          studentIds: parseQueryList('studentIds')
        };

        if (form && form !== 'all') criteria.grades.push(normalizeAcademicLevel(form));
        if (className && className !== 'all') criteria.classes.push(className);
        if (uploadedCategory && uploadedCategory !== 'all') criteria.categories.push(uploadedCategory);

        criteria.grades = [...new Set(criteria.grades)];
        criteria.classes = [...new Set(criteria.classes)];
        criteria.categories = [...new Set(criteria.categories)];

        const resolved = await resolveDeliveryRecipients(criteria);

        console.log(`✅ Resolved ${resolved.recipients.length} delivery recipients in ${Date.now() - startTime}ms`);

        return NextResponse.json({
          success: true,
          senderReference: criteria.senderReference,
          deliveryChannel: 'whatsapp',
          criteria,
          recipientCount: resolved.recipients.length,
          missingPhoneCount: resolved.missingPhoneCount,
          totalMatchedStudents: resolved.totalMatched,
          contacts: resolved.recipients.slice(0, limit)
        });
      } catch (dbError) {
        console.error('❌ Error resolving contacts:', dbError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to resolve delivery contacts',
            message: process.env.NODE_ENV === 'development' ? dbError.message : 'Processing error'
          },
          { status: 500 }
        );
      }
    }
    
    if (action === 'stats') {
      try {
        // Calculate fresh statistics with filters
        const statsResult = await calculateStatistics(where);
        
        // Update cache for consistency
        if (Object.keys(where).length === 0) {
          await updateCachedStats(statsResult.stats);
        }
        
        console.log(`✅ Calculated statistics in ${Date.now() - startTime}ms`);
        
        return NextResponse.json({
          success: true,
          data: {
            stats: statsResult.stats,
            filters,
            validation: statsResult.validation,
            timestamp: new Date().toISOString()
          }
        });
      } catch (dbError) {
        console.error('❌ Error calculating statistics:', dbError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to calculate statistics',
            message: process.env.NODE_ENV === 'development' ? dbError.message : 'Calculation error'
          },
          { status: 500 }
        );
      }
    }

    // Get students with pagination
    try {
      const orderBy = {};
      orderBy[validSortBy] = validSortOrder;

      const [students, total] = await Promise.all([
        prisma.databaseStudent.findMany({
          where,
          orderBy,
          skip: Math.max(0, (page - 1) * limit),
          take: limit,
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            middleName: true,
            lastName: true,
            fullName: true,
            form: true,
            gradeLevel: true,
            className: true,
            stream: true,
            dateOfBirth: true,
            gender: true,
            parentPhone: true,
            studentPhone: true,
            whatsappPhone: true,
            email: true,
            address: true,
            uploadedCategory: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            uploadBatchId: true,
            uploadBatch: {
              select: {
                fileName: true,
                uploadDate: true
              }
            }
          }
        }),
        prisma.databaseStudent.count({ where })
      ]);

      // Calculate statistics for this filtered set
      let statsResult = null;
      if (includeStats) {
        statsResult = await calculateStatistics(where);
        
        // If no filters, update cache
        if (Object.keys(where).length === 0) {
          await updateCachedStats(statsResult.stats);
        }
      }

      console.log(`✅ Fetched ${students.length} students in ${Date.now() - startTime}ms`);

      return NextResponse.json({
        success: true,
        data: {
          students: students || [],
          stats: statsResult?.stats || null,
          filters,
          validation: statsResult?.validation || null,
          pagination: { 
            page, 
            limit, 
            total, 
            pages: Math.ceil(total / limit) 
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (dbError) {
      console.error('❌ Error fetching students:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch students',
          message: process.env.NODE_ENV === 'development' ? dbError.message : 'Database error',
          details: {
            filters,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch data',
        message: 'An unexpected error occurred while processing your request',
        timestamp: new Date().toISOString(),
        debug: process.env.NODE_ENV === 'development' ? {
          errorName: error.name,
          stack: error.stack
        } : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Bulk upload with new strategy (with authentication)
export async function POST(request) {
  try {
    // Step 1: Authenticate the POST request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student bulk upload request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType'); // 'new' or 'update'
    const formsInput = formData.get('forms'); // JSON string for forms
    const targetForm = formData.get('targetForm'); // Single form for updates
    const checkDuplicates = formData.get('checkDuplicates') === 'true';
    const duplicateAction = formData.get('duplicateAction') || 'skip'; // 'skip' or 'replace'
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    if (!uploadType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Upload type is required (new or update)',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    // Validate form selection based on upload type
    let selectedForms = [];
    if (uploadType === 'new') {
      if (!formsInput) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Please select at least one form for new upload',
            authenticated: true 
          },
          { status: 400 }
        );
      }
      try {
        const forms = JSON.parse(formsInput);
        selectedForms = validateFormSelection(forms);
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid form selection',
            authenticated: true 
          },
          { status: 400 }
        );
      }
    } else if (uploadType === 'update') {
      if (!targetForm) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Target form is required for update upload',
            authenticated: true 
          },
          { status: 400 }
        );
      }
      selectedForms = validateFormSelection([targetForm]);
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid upload type. Must be "new" or "update"',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    const validExtensions = ['csv', 'xlsx', 'xls', 'pdf'];
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type. Please upload PDF, Excel, spreadsheet, or CSV (pdf/xlsx/xls/csv) files.',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    // Create batch record with uploader info from authentication
    const batchId = `BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadBatch = await prisma.studentBulkUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy: auth.user.name, // Use authenticated user's name
        status: 'processing',
        metadata: {
          uploadType,
          selectedForms,
          targetForm: uploadType === 'update' ? targetForm : null,
          uploadedBy: auth.user.name,
          userRole: auth.user.role,
          timestamp: new Date()
        }
      }
    });
    
    try {
      // Parse file
      let rawData = [];
      
      if (fileExtension === 'csv') {
        rawData = await parseCSV(file);
      } else if (fileExtension === 'pdf') {
        rawData = await parsePDF(file);
      } else {
        rawData = await parseExcel(file);
      }
      
      if (rawData.length === 0) {
        throw new Error('No readable student rows were found in the file. Confirm the template headers and that the sheet is not empty.');
      }
      
      // If just checking for duplicates
      if (checkDuplicates) {
        let duplicates = [];
        
        if (uploadType === 'new') {
          // Check for duplicates across all forms
          duplicates = await checkDuplicateAdmissionNumbers(rawData);
        } else if (uploadType === 'update') {
          // Check for duplicates in the target form
          duplicates = await checkDuplicateAdmissionNumbers(rawData, targetForm);
        }

        await prisma.studentBulkUpload.update({
          where: { id: batchId },
          data: {
            status: 'completed',
            processedDate: new Date(),
            totalRows: rawData.length,
            validRows: Math.max(0, rawData.length - duplicates.length),
            skippedRows: duplicates.length,
            errorRows: 0,
            metadata: {
              ...uploadBatch.metadata,
              duplicateCheckOnly: true,
              duplicatesFound: duplicates.length,
              checkedAt: new Date().toISOString()
            }
          }
        });
        
        return NextResponse.json({
          success: true,
          hasDuplicates: duplicates.length > 0,
          duplicates: duplicates,
          totalRows: rawData.length,
          authenticated: true,
          uploadedBy: auth.user.name,
          message: duplicates.length > 0 
            ? `Found ${duplicates.length} duplicate admission numbers` 
            : 'No duplicates found'
        });
      }
      
      let processingStats;
      
// Use transaction for consistency with increased timeout
await prisma.$transaction(async (tx) => {
  if (uploadType === 'new') {
    // Process new upload
    processingStats = await processNewUpload(rawData, batchId, selectedForms, duplicateAction, tx);
    
    // Update batch with new upload stats
    await tx.studentBulkUpload.update({
      where: { id: batchId },
      data: {
        status: 'completed',
        processedDate: new Date(),
        totalRows: processingStats.totalRows,
        validRows: processingStats.validRows,
        skippedRows: processingStats.skippedRows,
        errorRows: processingStats.errorRows,
        errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 50) : undefined,
        metadata: {
          ...uploadBatch.metadata,
          restoredAccounts: processingStats.restoredAccounts || 0,
          largeUpload: rawData.length >= LARGE_UPLOAD_ROW_THRESHOLD,
          chunkSize: DB_BATCH_SIZE
        }
      }
    });
    
    // Update statistics - OPTIMIZED VERSION
    if (processingStats.createdStudents.length > 0) {
      const formCounts = {};
      processingStats.createdStudents.forEach(student => {
        formCounts[student.form] = (formCounts[student.form] || 0) + 1;
      });
      
      // Update stats in bulk without recalculating everything
      await tx.studentStats.upsert({
        where: { id: 'global_stats' },
        update: {
          totalStudents: { increment: processingStats.createdStudents.length },
          ...(formCounts['Form 1'] && { form1: { increment: formCounts['Form 1'] } }),
          ...(formCounts['Form 2'] && { form2: { increment: formCounts['Form 2'] } }),
          ...(formCounts['Form 3'] && { form3: { increment: formCounts['Form 3'] } }),
          ...(formCounts['Form 4'] && { form4: { increment: formCounts['Form 4'] } }),
          ...(formCounts['Grade 10'] && { grade10: { increment: formCounts['Grade 10'] } }),
          ...(formCounts['Grade 11'] && { grade11: { increment: formCounts['Grade 11'] } }),
          ...(formCounts['Grade 12'] && { grade12: { increment: formCounts['Grade 12'] } }),
          updatedAt: new Date()
        },
        create: {
          id: 'global_stats',
          totalStudents: processingStats.createdStudents.length,
          form1: formCounts['Form 1'] || 0,
          form2: formCounts['Form 2'] || 0,
          form3: formCounts['Form 3'] || 0,
          form4: formCounts['Form 4'] || 0,
          grade10: formCounts['Grade 10'] || 0,
          grade11: formCounts['Grade 11'] || 0,
          grade12: formCounts['Grade 12'] || 0
        }
      });
    }
    
  } else if (uploadType === 'update') {
    // Process update upload
    processingStats = await processUpdateUpload(rawData, batchId, targetForm, tx);
    
    // Update batch with update stats
    await tx.studentBulkUpload.update({
      where: { id: batchId },
      data: {
        status: 'completed',
        processedDate: new Date(),
        totalRows: processingStats.totalRows,
        validRows: processingStats.validRows,
        skippedRows: processingStats.errorRows,
        errorRows: processingStats.errorRows,
        errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 50) : undefined,
        metadata: {
          ...uploadBatch.metadata,
          updatedRows: processingStats.updatedRows,
          createdRows: processingStats.createdRows,
          deactivatedRows: processingStats.deactivatedRows,
          restoredAccounts: processingStats.restoredAccounts || 0,
          largeUpload: rawData.length >= LARGE_UPLOAD_ROW_THRESHOLD,
          chunkSize: DB_BATCH_SIZE
        }
      }
    });
    
    const formStats = await tx.databaseStudent.groupBy({
      by: ['form'],
      where: { status: 'active' },
      _count: { id: true }
    });
    
    const formStatsObj = {};
    formStats.forEach(stat => {
      formStatsObj[stat.form] = stat._count.id;
    });
    
    await tx.studentStats.upsert({
      where: { id: 'global_stats' },
      update: {
        totalStudents: formStats.reduce((sum, stat) => sum + stat._count.id, 0),
        form1: formStatsObj['Form 1'] || 0,
        form2: formStatsObj['Form 2'] || 0,
        form3: formStatsObj['Form 3'] || 0,
        form4: formStatsObj['Form 4'] || 0,
        grade10: formStatsObj['Grade 10'] || 0,
        grade11: formStatsObj['Grade 11'] || 0,
        grade12: formStatsObj['Grade 12'] || 0,
        updatedAt: new Date()
      },
      create: {
        id: 'global_stats',
        totalStudents: formStats.reduce((sum, stat) => sum + stat._count.id, 0),
        form1: formStatsObj['Form 1'] || 0,
        form2: formStatsObj['Form 2'] || 0,
        form3: formStatsObj['Form 3'] || 0,
        form4: formStatsObj['Form 4'] || 0,
        grade10: formStatsObj['Grade 10'] || 0,
        grade11: formStatsObj['Grade 11'] || 0,
        grade12: formStatsObj['Grade 12'] || 0
      }
    });
  }
}, {
  maxWait: 30000,
  timeout: rawData.length >= LARGE_UPLOAD_ROW_THRESHOLD ? LARGE_UPLOAD_TIMEOUT_MS : STANDARD_UPLOAD_TIMEOUT_MS
});
      
      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});
      
      console.log(`✅ Student upload completed by ${auth.user.name}: ${processingStats.validRows} students processed`);
      
      return NextResponse.json({
        success: true,
        message: uploadType === 'new'
          ? `Successfully processed ${processingStats.validRows} new students${processingStats.restoredAccounts ? ` and restored ${processingStats.restoredAccounts} portal account${processingStats.restoredAccounts === 1 ? '' : 's'}` : ''}`
          : `Successfully updated form ${targetForm}: ${processingStats.updatedRows} updated, ${processingStats.createdRows} created, ${processingStats.deactivatedRows} deactivated${processingStats.restoredAccounts ? `, ${processingStats.restoredAccounts} portal account${processingStats.restoredAccounts === 1 ? '' : 's'} restored` : ''}`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          status: 'completed',
          uploadType,
          selectedForms
        },
        stats: finalStats.stats,
        validation: finalStats.validation,
        processingStats: processingStats,
        authenticated: true,
        uploadedBy: auth.user.name, 
        errors: processingStats.errors.slice(0, 20),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Processing error during file parse:', error.message);
      const safeErrorMessage = normalizeStudentUploadFailure(error);
      
      // Update batch as failed
      try {
        await prisma.studentBulkUpload.update({
          where: { id: batchId },
          data: {
            status: 'failed',
            processedDate: new Date(),
            errorRows: 1,
            errorLog: [safeErrorMessage]
          }
        });
      } catch (updateError) {
        console.error('❌ Failed to update batch status:', updateError);
      }
      
      throw new Error(safeErrorMessage);
    }
    
  } catch (error) {
    console.error('❌ POST error:', error.message);
    
    const isClientError = [
      'No file provided',
      'Upload type is required',
      'Please select',
      'Invalid form selection',
      'Invalid file type',
      'CSV parsing failed',
      'Excel parsing failed',
      'PDF parsing failed',
      'No readable student rows',
      'Missing required columns',
      'took too long',
      'interrupted'
    ].some((phrase) => (error.message || '').includes(phrase));
    
    const statusCode = isClientError ? 400 : 500;
    const errorResponse = {
      success: false,
      error: error.message || 'Upload processing failed',
      authenticated: true,
      timestamp: new Date().toISOString(),
      suggestion: 'Verify file format: admission#, name, class/grade, phone required. For large files, keep page open until completion.'
    };
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.debug = {
        errorType: error.name,
        stack: error.stack?.split('\n').slice(0, 5) || []
      };
    }
    
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}


// PUT - Update student with transaction (PROTECTED - authentication required)
export async function PUT(request) {
  try {
    // Step 1: Authenticate the PUT request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student update request from: ${auth.user.name} (${auth.user.role})`);

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required', authenticated: true },
        { status: 400 }
      );
    }

    // Use transaction for consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get current student
      const currentStudent = await tx.databaseStudent.findUnique({
        where: { id }
      });

      if (!currentStudent) {
        throw new Error('Student not found');
      }

      // Check admission number uniqueness
      if (updateData.admissionNumber && updateData.admissionNumber !== currentStudent.admissionNumber) {
        const existing = await tx.databaseStudent.findFirst({
          where: {
            admissionNumber: updateData.admissionNumber,
            NOT: { id: id }
          }
        });

        if (existing) {
          throw new Error('Admission number already exists');
        }
      }

      delete updateData.dateOfBirth;
      delete updateData.gender;
      delete updateData.address;

      if (updateData.form) {
        updateData.form = normalizeAcademicLevel(updateData.form);
        updateData.gradeLevel = updateData.gradeLevel || updateData.form;
      }

      updateData.parentPhone = normalizeLocalMobilePhone(updateData.parentPhone || updateData.whatsappPhone || updateData.studentPhone || '');
      updateData.studentPhone = normalizeLocalMobilePhone(updateData.studentPhone || '');
      updateData.whatsappPhone = normalizeLocalMobilePhone(updateData.whatsappPhone || updateData.parentPhone || updateData.studentPhone || '');
      updateData.fullName = buildStudentFullName(updateData);
      updateData.className = buildClassName(updateData.form || currentStudent.form, updateData.stream || currentStudent.stream, updateData.className);

      // Update student with audit info
      const updatedStudent = await tx.databaseStudent.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
          
        }
      });

      if (updateData.admissionNumber && updateData.admissionNumber !== currentStudent.admissionNumber) {
        await tx.studentPortalAccount.updateMany({
          where: { admissionNumber: currentStudent.admissionNumber },
          data: { admissionNumber: updateData.admissionNumber }
        });
      }

      // Update stats if form changed
      if (updateData.form && updateData.form !== currentStudent.form) {
        // Decrement count from old form
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            ...(currentStudent.form === 'Form 1' && { form1: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 2' && { form2: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 3' && { form3: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 4' && { form4: { decrement: 1 } }),
            ...(currentStudent.form === 'Grade 10' && { grade10: { decrement: 1 } }),
            ...(currentStudent.form === 'Grade 11' && { grade11: { decrement: 1 } }),
            ...(currentStudent.form === 'Grade 12' && { grade12: { decrement: 1 } })
          }
        });

        // Increment count to new form
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            ...(updateData.form === 'Form 1' && { form1: { increment: 1 } }),
            ...(updateData.form === 'Form 2' && { form2: { increment: 1 } }),
            ...(updateData.form === 'Form 3' && { form3: { increment: 1 } }),
            ...(updateData.form === 'Form 4' && { form4: { increment: 1 } }),
            ...(updateData.form === 'Grade 10' && { grade10: { increment: 1 } }),
            ...(updateData.form === 'Grade 11' && { grade11: { increment: 1 } }),
            ...(updateData.form === 'Grade 12' && { grade12: { increment: 1 } })
          }
        });
      }

      return updatedStudent;
    });

    // Recalculate to ensure consistency
    const finalStats = await calculateStatistics({});

    console.log(`✅ Student updated by ${auth.user.name}: ${result.firstName} ${result.lastName}`);

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      data: {
        student: result,
        stats: finalStats.stats,
        validation: finalStats.validation
      },
      authenticated: true,

    });

  } catch (error) {
    console.error('PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Student not found', authenticated: true },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Update failed',
        authenticated: true
      },
      { status: 500 }
    );
  }
}

// DELETE - Student or batch with transaction (PROTECTED - authentication required)
export async function DELETE(request) {
  try {
    // Step 1: Authenticate the DELETE request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Student delete request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const studentId = url.searchParams.get('studentId');
    const hardDelete = url.searchParams.get('hardDelete') === 'true';
    const purgePortalAuth = url.searchParams.get('purgePortalAuth') === 'true';

    if (batchId) {
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.studentBulkUpload.findUnique({
          where: { id: batchId }
        });

        if (!batch) {
          throw new Error('Batch not found');
        }

        const batchStudents = await tx.databaseStudent.findMany({
          where: { uploadBatchId: batchId },
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            middleName: true,
            lastName: true,
            form: true,
            stream: true,
            email: true,
            parentPhone: true,
            uploadBatchId: true,
            status: true
          }
        });

        const archiveResult = purgePortalAuth
          ? { archivedCount: 0 }
          : await archiveStudentPortalCredentials(tx, batchStudents, {
              sourceBatchId: batchId,
              archiveReason: hardDelete ? 'batch-hard-delete' : 'batch-delete',
              deletedBy: auth.user?.id || auth.user?.email || auth.user?.name || null
            });

        const formCounts = batchStudents.reduce((acc, student) => {
          if (student.status === 'active') {
            acc[student.form] = (acc[student.form] || 0) + 1;
          }
          return acc;
        }, {});

        if (hardDelete) {
          // Hard delete students
          await tx.databaseStudent.deleteMany({
            where: { uploadBatchId: batchId }
          });

          if (purgePortalAuth) {
            await tx.studentPortalAccount.deleteMany({
              where: {
                admissionNumber: {
                  in: batchStudents.map(student => student.admissionNumber).filter(Boolean)
                }
              }
            });
            await tx.archivedStudentPortalCredential.deleteMany({
              where: {
                admissionNumber: {
                  in: batchStudents.map(student => student.admissionNumber).filter(Boolean)
                }
              }
            });
          }
        } else {
          // Soft delete students (mark as inactive)
          await tx.databaseStudent.updateMany({
            where: { uploadBatchId: batchId },
            data: {
              status: 'inactive',
              updatedAt: new Date(),
              
            }
          });
        }

        // Update stats if hard deleting
        if (hardDelete) {
          await tx.studentStats.update({
            where: { id: 'global_stats' },
            data: {
              totalStudents: { decrement: batchStudents.length },
              form1: { decrement: formCounts['Form 1'] || 0 },
              form2: { decrement: formCounts['Form 2'] || 0 },
              form3: { decrement: formCounts['Form 3'] || 0 },
              form4: { decrement: formCounts['Form 4'] || 0 },
              grade10: { decrement: formCounts['Grade 10'] || 0 },
              grade11: { decrement: formCounts['Grade 11'] || 0 },
              grade12: { decrement: formCounts['Grade 12'] || 0 }
            }
          });
        }

        // Delete batch record
        await tx.studentBulkUpload.delete({
          where: { id: batchId }
        });

        return { 
          batch, 
          deletedCount: batchStudents.length,
          archivedCredentialCount: archiveResult.archivedCount,
          purgedPortalAuth: hardDelete && purgePortalAuth,
          deletionType: hardDelete ? 'hard' : 'soft'
        };
      });

      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});

      console.log(`✅ Batch deleted by ${auth.user.name}: ${result.batch.fileName} (${result.deletedCount} students)`);

      return NextResponse.json({
        success: true,
        message: `${result.deletionType === 'hard' ? 'Hard deleted' : 'Soft deleted'} batch ${result.batch.fileName} and ${result.deletedCount} students`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation,
          archivedCredentialCount: result.archivedCredentialCount,
          purgedPortalAuth: result.purgedPortalAuth
        },
        authenticated: true,
      });
    }

    if (studentId) {
      const result = await prisma.$transaction(async (tx) => {
        const student = await tx.databaseStudent.findUnique({
          where: { id: studentId },
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            middleName: true,
            lastName: true,
            form: true,
            stream: true,
            email: true,
            parentPhone: true,
            uploadBatchId: true,
            status: true
          }
        });

        if (!student) {
          throw new Error('Student not found');
        }

        const archiveResult = purgePortalAuth
          ? { archivedCount: 0 }
          : await archiveStudentPortalCredentials(tx, [student], {
              sourceBatchId: student.uploadBatchId || null,
              archiveReason: hardDelete ? 'student-hard-delete' : 'student-delete',
              deletedBy: auth.user?.id || auth.user?.email || auth.user?.name || null
            });

        if (hardDelete) {
          // Hard delete student
          await tx.databaseStudent.delete({
            where: { id: studentId }
          });

          if (purgePortalAuth) {
            await tx.studentPortalAccount.deleteMany({
              where: { admissionNumber: student.admissionNumber }
            });
            await tx.archivedStudentPortalCredential.deleteMany({
              where: { admissionNumber: student.admissionNumber }
            });
          }

          // Update stats
          await tx.studentStats.update({
            where: { id: 'global_stats' },
            data: {
              totalStudents: { decrement: 1 },
              ...(student.form === 'Form 1' && { form1: { decrement: 1 } }),
              ...(student.form === 'Form 2' && { form2: { decrement: 1 } }),
              ...(student.form === 'Form 3' && { form3: { decrement: 1 } }),
              ...(student.form === 'Form 4' && { form4: { decrement: 1 } }),
              ...(student.form === 'Grade 10' && { grade10: { decrement: 1 } }),
              ...(student.form === 'Grade 11' && { grade11: { decrement: 1 } }),
              ...(student.form === 'Grade 12' && { grade12: { decrement: 1 } })
            }
          });
        } else {
          // Soft delete student (mark as inactive)
          await tx.databaseStudent.update({
            where: { id: studentId },
            data: {
              status: 'inactive',
              updatedAt: new Date(),
             
            }
          });
        }

        return {
          student,
          archivedCredentialCount: archiveResult.archivedCount,
          purgedPortalAuth: hardDelete && purgePortalAuth,
          deletionType: hardDelete ? 'hard' : 'soft'
        };
      });

      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});

      console.log(`✅ Student deleted by ${auth.user.name}: ${result.student.firstName} ${result.student.lastName}`);

      return NextResponse.json({
        success: true,
        message: `${result.deletionType === 'hard' ? 'Hard deleted' : 'Soft deleted'} student ${result.student.firstName} ${result.student.lastName}`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation,
          archivedCredentialCount: result.archivedCredentialCount,
          purgedPortalAuth: result.purgedPortalAuth
        },
        authenticated: true,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide batchId or studentId', authenticated: true },
      { status: 400 }
    );

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed', authenticated: true },
      { status: 500 }
    );
  }
}

// PATCH - Reactivate inactive students (PROTECTED - authentication required)
export async function PATCH(request) {
  try {
    // Step 1: Authenticate the PATCH request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student reactivate request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    const batchId = url.searchParams.get('batchId');
    const form = url.searchParams.get('form');

    if (studentId) {
      // Reactivate single student
      const student = await prisma.databaseStudent.update({
        where: { id: studentId },
        data: {
          status: 'active',
          updatedAt: new Date(),
          
        }
      });
      const restoreResult = await restoreStudentPortalCredentials(prisma, [student]);

      console.log(`✅ Student reactivated by ${auth.user.name}: ${student.firstName} ${student.lastName}`);

      return NextResponse.json({
        success: true,
        message: `Student ${student.firstName} ${student.lastName} reactivated${restoreResult.restoredCount ? ' and portal password restored' : ''}`,
        data: { student, restoredAccounts: restoreResult.restoredCount },
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    if (batchId) {
      // Reactivate all students in a batch
      const result = await prisma.$transaction(async (tx) => {
        const studentsToRestore = await tx.databaseStudent.findMany({
          where: {
            uploadBatchId: batchId,
            status: 'inactive'
          }
        });

        const updated = await tx.databaseStudent.updateMany({
          where: { 
            uploadBatchId: batchId,
            status: 'inactive'
          },
          data: {
            status: 'active',
            updatedAt: new Date(),
            
          }
        });

        const restoreResult = await restoreStudentPortalCredentials(tx, studentsToRestore);

        // Update statistics
        const batchStudents = await tx.databaseStudent.findMany({
          where: { uploadBatchId: batchId },
          select: { form: true }
        });

        const formCounts = batchStudents.reduce((acc, student) => {
          acc[student.form] = (acc[student.form] || 0) + 1;
          return acc;
        }, {});

        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            totalStudents: { increment: updated.count },
            form1: { increment: formCounts['Form 1'] || 0 },
            form2: { increment: formCounts['Form 2'] || 0 },
            form3: { increment: formCounts['Form 3'] || 0 },
            form4: { increment: formCounts['Form 4'] || 0 },
            grade10: { increment: formCounts['Grade 10'] || 0 },
            grade11: { increment: formCounts['Grade 11'] || 0 },
            grade12: { increment: formCounts['Grade 12'] || 0 }
          }
        });

        return { count: updated.count, restoredAccounts: restoreResult.restoredCount };
      });

      console.log(`✅ Batch reactivated by ${auth.user.name}: ${result.count} students`);

      return NextResponse.json({
        success: true,
        message: `Reactivated ${result.count} students from batch${result.restoredAccounts ? ` and restored ${result.restoredAccounts} portal account${result.restoredAccounts === 1 ? '' : 's'}` : ''}`,
        data: result,
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    if (form) {
      // Reactivate all inactive students in a form
      const result = await prisma.$transaction(async (tx) => {
        const studentsToRestore = await tx.databaseStudent.findMany({
          where: {
            form: form,
            status: 'inactive'
          }
        });

        const updated = await tx.databaseStudent.updateMany({
          where: { 
            form: form,
            status: 'inactive'
          },
          data: {
            status: 'active',
            updatedAt: new Date(),
            
          }
        });

        const restoreResult = await restoreStudentPortalCredentials(tx, studentsToRestore);

        // Update statistics
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            totalStudents: { increment: updated.count },
            ...(form === 'Form 1' && { form1: { increment: updated.count } }),
            ...(form === 'Form 2' && { form2: { increment: updated.count } }),
            ...(form === 'Form 3' && { form3: { increment: updated.count } }),
            ...(form === 'Form 4' && { form4: { increment: updated.count } }),
            ...(form === 'Grade 10' && { grade10: { increment: updated.count } }),
            ...(form === 'Grade 11' && { grade11: { increment: updated.count } }),
            ...(form === 'Grade 12' && { grade12: { increment: updated.count } })
          }
        });

        return { count: updated.count, restoredAccounts: restoreResult.restoredCount };
      });

      console.log(`✅ Form reactivated by ${auth.user.name}: ${result.count} students in ${form}`);

      return NextResponse.json({
        success: true,
        message: `Reactivated ${result.count} students in ${form}${result.restoredAccounts ? ` and restored ${result.restoredAccounts} portal account${result.restoredAccounts === 1 ? '' : 's'}` : ''}`,
        data: result,
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide studentId, batchId, or form', authenticated: true },
      { status: 400 }
    );

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Reactivate failed', authenticated: true },
      { status: 500 }
    );
  }
}
