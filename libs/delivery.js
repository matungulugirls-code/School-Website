import { prisma } from './prisma';
import { normalizeEmailAddress } from './emailDelivery';

export const SCHOOL_COMMUNICATION_NUMBER = '0793472960';
export const SCHOOL_COMMUNICATION_EMAIL = process.env.EMAIL_USER || 'school@example.com';
const EMAIL_DELIVERY_REFERENCE = 'email';

export const ACADEMIC_LEVEL_OPTIONS = [
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Form 3',
  'Form 4'
];

const normalizeLocalMobilePhone = (value = '') => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return null;
  if (/^07\d{8}$/.test(digits)) return digits;
  if (/^7\d{8}$/.test(digits)) return `0${digits}`;
  if (/^2547\d{8}$/.test(digits)) return `0${digits.slice(3)}`;
  return null;
};

export const normalizeAcademicLevel = (value = '') => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');

  const levelMap = {
    grade10: 'Grade 10',
    'grade 10': 'Grade 10',
    g10: 'Grade 10',
    'g 10': 'Grade 10',
    '10': 'Grade 10',
    grade11: 'Grade 11',
    'grade 11': 'Grade 11',
    g11: 'Grade 11',
    'g 11': 'Grade 11',
    '11': 'Grade 11',
    grade12: 'Grade 12',
    'grade 12': 'Grade 12',
    g12: 'Grade 12',
    'g 12': 'Grade 12',
    '12': 'Grade 12',
    form3: 'Form 3',
    'form 3': 'Form 3',
    f3: 'Form 3',
    'f 3': 'Form 3',
    '3': 'Form 3',
    form4: 'Form 4',
    'form 4': 'Form 4',
    f4: 'Form 4',
    'f 4': 'Form 4',
    '4': 'Form 4'
  };

  return levelMap[normalized.replace(/\s+/g, '')] || levelMap[normalized] || String(value || '').trim();
};

const parseListValue = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  const stringValue = String(value).trim();
  if (!stringValue) return [];

  try {
    const parsed = JSON.parse(stringValue);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    // Fall through to comma-separated parsing.
  }

  return stringValue
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

const unique = (items = []) => [...new Set(items.filter(Boolean))];

const parseFormList = (formData, key) => {
  if (!formData) return [];
  const values = typeof formData.getAll === 'function'
    ? formData.getAll(key)
    : [formData.get?.(key)];

  return values.flatMap(value => parseListValue(value));
};

export const buildDeliveryCriteriaFromFormData = (formData, fallbackClassName = '', fallbackCategory = '') => {
  const explicitClasses = unique([
    ...parseFormList(formData, 'targetClasses'),
    ...parseFormList(formData, 'targetClass')
  ].map(item => String(item || '').trim()).filter(item => item && !/^all classes$/i.test(item)));

  const grades = unique([
    ...parseFormList(formData, 'targetGrades'),
    ...parseFormList(formData, 'targetGrade')
  ].map(normalizeAcademicLevel).filter(Boolean));

  const explicitCategories = unique([
    ...parseFormList(formData, 'targetCategories'),
    ...parseFormList(formData, 'targetCategory'),
    ...parseFormList(formData, 'uploadedCategory'),
    ...parseFormList(formData, 'deliveryCategory')
  ].map(item => String(item || '').trim()).filter(Boolean));

  const studentIds = unique([
    ...parseFormList(formData, 'targetStudentIds'),
    ...parseFormList(formData, 'targetStudents')
  ].map(item => String(item || '').trim()));

  const hasExplicitCriteria = explicitClasses.length > 0 || grades.length > 0 || explicitCategories.length > 0 || studentIds.length > 0;
  const classes = hasExplicitCriteria
    ? explicitClasses
    : unique([fallbackClassName].map(item => String(item || '').trim()).filter(Boolean));
  const categories = hasExplicitCriteria
    ? explicitCategories
    : unique([fallbackCategory].map(item => String(item || '').trim()).filter(Boolean));

  const senderReference = EMAIL_DELIVERY_REFERENCE;

  return {
    channel: 'email',
    senderReference,
    grades,
    classes,
    categories,
    studentIds
  };
};

const buildDeliveryWhere = (criteria = {}) => {
  const andClauses = [{ status: 'active' }];

  if (criteria.studentIds?.length) {
    andClauses.push({ id: { in: criteria.studentIds } });
  }

  if (criteria.grades?.length) {
    andClauses.push({
      OR: [
        { form: { in: criteria.grades } },
        { gradeLevel: { in: criteria.grades } }
      ]
    });
  }

  if (criteria.classes?.length) {
    const normalizedClassLevels = criteria.classes.map(normalizeAcademicLevel);
    andClauses.push({
      OR: [
        { className: { in: criteria.classes } },
        { stream: { in: criteria.classes } },
        { form: { in: normalizedClassLevels } },
        { gradeLevel: { in: normalizedClassLevels } }
      ]
    });
  }

  if (criteria.categories?.length) {
    andClauses.push({
      uploadedCategory: { in: criteria.categories }
    });
  }

  return { AND: andClauses };
};

const getStudentDisplayName = (student = {}) =>
  student.fullName ||
  [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

export const resolveDeliveryRecipients = async (criteria = {}, tx = prisma) => {
  const students = await tx.databaseStudent.findMany({
    where: buildDeliveryWhere(criteria),
    select: {
      id: true,
      admissionNumber: true,
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      form: true,
      stream: true,
      className: true,
      gradeLevel: true,
      uploadedCategory: true,
      email: true,
      parentPhone: true,
      studentPhone: true,
      whatsappPhone: true
    },
    orderBy: [
      { form: 'asc' },
      { className: 'asc' },
      { firstName: 'asc' }
    ]
  });

  const recipients = [];
  const missingEmailStudents = [];
  const seenEmails = new Set();

  for (const student of students) {
    const parentEmail = normalizeEmailAddress(student.email);
    if (!parentEmail) {
      missingEmailStudents.push(student);
      continue;
    }

    const duplicateKey = `${student.admissionNumber}:${parentEmail}`;
    if (seenEmails.has(duplicateKey)) continue;
    seenEmails.add(duplicateKey);

    recipients.push({
      studentId: student.id,
      admissionNumber: student.admissionNumber,
      studentName: getStudentDisplayName(student),
      className: student.className || [student.form, student.stream].filter(Boolean).join(' ') || student.form || null,
      gradeLevel: student.gradeLevel || student.form || null,
      uploadedCategory: student.uploadedCategory || null,
      parentEmail,
      whatsappPhone: normalizeLocalMobilePhone(student.whatsappPhone) || normalizeLocalMobilePhone(student.parentPhone) || SCHOOL_COMMUNICATION_NUMBER
    });
  }

  return {
    recipients,
    missingEmailCount: missingEmailStudents.length,
    totalMatched: students.length
  };
};

export const buildDeliverySummary = (criteria, resolvedRecipients) => ({
  channel: 'email',
  senderReference: criteria.senderReference || EMAIL_DELIVERY_REFERENCE,
  status: resolvedRecipients.recipients.length > 0 ? 'prepared' : 'no_recipients',
  recipientCount: resolvedRecipients.recipients.length,
  totalMatchedStudents: resolvedRecipients.totalMatched,
  missingPhoneCount: 0,
  missingEmailCount: resolvedRecipients.missingEmailCount,
  criteria: {
    grades: criteria.grades || [],
    classes: criteria.classes || [],
    categories: criteria.categories || [],
    studentIds: criteria.studentIds || []
  },
  preparedAt: new Date().toISOString()
});

export const prepareAssignmentDelivery = async (tx, assignmentId, criteria) => {
  const resolved = await resolveDeliveryRecipients(criteria, tx);

  await tx.assignmentDeliveryRecipient.deleteMany({
    where: { assignmentId }
  });

  if (resolved.recipients.length > 0) {
    await tx.assignmentDeliveryRecipient.createMany({
      data: resolved.recipients.map(recipient => ({
        assignmentId,
        studentId: recipient.studentId,
        admissionNumber: recipient.admissionNumber,
        studentName: recipient.studentName,
        className: recipient.className,
        gradeLevel: recipient.gradeLevel,
        uploadedCategory: recipient.uploadedCategory,
        whatsappPhone: recipient.whatsappPhone,
        senderReference: criteria.senderReference || EMAIL_DELIVERY_REFERENCE,
        channel: 'email',
        status: 'prepared'
      })),
      skipDuplicates: true
    });
  }

  return buildDeliverySummary(criteria, resolved);
};

export const prepareResourceDelivery = async (tx, resourceId, criteria) => {
  const resolved = await resolveDeliveryRecipients(criteria, tx);

  await tx.resourceDeliveryRecipient.deleteMany({
    where: { resourceId }
  });

  if (resolved.recipients.length > 0) {
    await tx.resourceDeliveryRecipient.createMany({
      data: resolved.recipients.map(recipient => ({
        resourceId,
        studentId: recipient.studentId,
        admissionNumber: recipient.admissionNumber,
        studentName: recipient.studentName,
        className: recipient.className,
        gradeLevel: recipient.gradeLevel,
        uploadedCategory: recipient.uploadedCategory,
        whatsappPhone: recipient.whatsappPhone,
        senderReference: criteria.senderReference || EMAIL_DELIVERY_REFERENCE,
        channel: 'email',
        status: 'prepared'
      })),
      skipDuplicates: true
    });
  }

  return buildDeliverySummary(criteria, resolved);
};
