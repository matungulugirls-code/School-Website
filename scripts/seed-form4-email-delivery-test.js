require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const path = require('path');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

const normalizeEmailAddress = (value = '') => {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

const sendEmail = async ({ to, subject, text, html, attachments }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: `"${process.env.SCHOOL_NAME || 'Matungulu Girls Senior School'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });
};

const getStudentName = (student) =>
  student.fullName || [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');

const publicAttachment = (publicUrl, filename) => ({
  filename,
  path: path.join(process.cwd(), 'public', publicUrl.replace(/^\//, '')),
});

const main = async () => {
  const testEmail = normalizeEmailAddress(process.env.TEST_PARENT_EMAIL || process.env.EMAIL_USER);
  if (!testEmail) {
    throw new Error('No test email found. Set TEST_PARENT_EMAIL or EMAIL_USER.');
  }
  console.log(`Using test parent email: ${testEmail}`);

  const assignmentFileUrl = '/assignments/1763475285671-algebra_worksheet.pdf';
  const resourceFileUrl = '/assignments/1763475285672-formula_sheet.pdf';

  console.log('Upserting Form 4 test student...');
  const student = await prisma.databaseStudent.upsert({
    where: { admissionNumber: 'FORM4-EMAIL-TEST' },
    update: {
      firstName: 'Formfour',
      lastName: 'Emailtest',
      fullName: 'Formfour Emailtest',
      form: 'Form 4',
      gradeLevel: 'Form 4',
      className: 'Form 4',
      stream: 'Email',
      status: 'active',
      email: testEmail,
      parentPhone: '0793472960',
      whatsappPhone: '0793472960',
      uploadedCategory: 'email-delivery-test',
    },
    create: {
      admissionNumber: 'FORM4-EMAIL-TEST',
      firstName: 'Formfour',
      middleName: null,
      lastName: 'Emailtest',
      fullName: 'Formfour Emailtest',
      form: 'Form 4',
      gradeLevel: 'Form 4',
      className: 'Form 4',
      stream: 'Email',
      status: 'active',
      email: testEmail,
      parentPhone: '0793472960',
      studentPhone: null,
      whatsappPhone: '0793472960',
      uploadedCategory: 'email-delivery-test',
    },
  });
  console.log(`Student ready: ${student.admissionNumber} (${student.id})`);

  console.log('Creating Form 4 test assignment...');
  const assignment = await prisma.assignment.create({
    data: {
      title: 'FORM 4 EMAIL DELIVERY TEST ASSIGNMENT',
      subject: 'Mathematics',
      className: 'Form 4',
      teacher: 'System Test Teacher',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      dateAssigned: new Date(),
      status: 'pending',
      description: 'This is a test assignment email for Form 4 only. It includes an attached worksheet.',
      instructions: 'Open the attached worksheet and confirm the email delivery works.',
      assignmentFiles: [assignmentFileUrl],
      attachments: [],
      priority: 'medium',
      estimatedTime: '30 minutes',
      additionalWork: null,
      teacherRemarks: 'Seeded email delivery test.',
      feedback: null,
      learningObjectives: ['Verify Form 4 assignment email delivery with attachment'],
      targetCriteria: { channel: 'email', classes: ['Form 4'], grades: [], categories: [], studentIds: [student.id] },
      senderReference: 'email',
      deliveryStatus: 'prepared',
    },
  });
  console.log(`Assignment ready: ${assignment.id}`);

  console.log('Creating assignment email recipient...');
  await prisma.assignmentDeliveryRecipient.create({
    data: {
      assignmentId: assignment.id,
      studentId: student.id,
      admissionNumber: student.admissionNumber,
      studentName: getStudentName(student),
      className: student.className,
      gradeLevel: student.gradeLevel,
      uploadedCategory: student.uploadedCategory,
      whatsappPhone: '0793472960',
      senderReference: 'email',
      channel: 'email',
      status: 'prepared',
    },
  });

  console.log('Creating Form 4 test resource...');
  const resource = await prisma.resource.create({
    data: {
      title: 'FORM 4 EMAIL DELIVERY TEST RESOURCE',
      subject: 'Mathematics',
      teacher: 'System Test Teacher',
      className: 'Form 4',
      description: 'This is a test resource email for Form 4 only. It includes an attached formula sheet.',
      category: 'email-delivery-test',
      type: 'pdf',
      files: [
        {
          url: resourceFileUrl,
          name: 'formula_sheet.pdf',
          size: 0,
          extension: '.pdf',
          fileType: 'pdf',
          uploadedAt: new Date().toISOString(),
          storageType: 'local',
        },
      ],
      accessLevel: 'student',
      uploadedBy: 'System Test',
      downloads: 0,
      isActive: true,
      targetCriteria: { channel: 'email', classes: ['Form 4'], grades: [], categories: [], studentIds: [student.id] },
      senderReference: 'email',
      deliveryStatus: 'prepared',
    },
  });
  console.log(`Resource ready: ${resource.id}`);

  console.log('Creating resource email recipient...');
  await prisma.resourceDeliveryRecipient.create({
    data: {
      resourceId: resource.id,
      studentId: student.id,
      admissionNumber: student.admissionNumber,
      studentName: getStudentName(student),
      className: student.className,
      gradeLevel: student.gradeLevel,
      uploadedCategory: student.uploadedCategory,
      whatsappPhone: '0793472960',
      senderReference: 'email',
      channel: 'email',
      status: 'prepared',
    },
  });

  console.log('Sending assignment email with attachment...');
  const assignmentMail = await sendEmail({
    to: testEmail,
    subject: `New assignment: ${assignment.title}`,
    text: `Dear Parent/Guardian,\n\nA Form 4 test assignment has been shared for ${getStudentName(student)}.\n\nTitle: ${assignment.title}\nSubject: ${assignment.subject}\nTeacher: ${assignment.teacher}\nClass / Stream: ${student.className} ${student.stream}\n\nThe worksheet is attached.\n\nRegards,\nMatungulu Girls Senior School`,
    html: `<p>Dear Parent/Guardian,</p><p>A <strong>Form 4</strong> test assignment has been shared for <strong>${getStudentName(student)}</strong>.</p><ul><li><strong>Title:</strong> ${assignment.title}</li><li><strong>Subject:</strong> ${assignment.subject}</li><li><strong>Teacher:</strong> ${assignment.teacher}</li><li><strong>Class / Stream:</strong> ${student.className} ${student.stream}</li></ul><p>The worksheet is attached.</p><p>Regards,<br/>Matungulu Girls Senior School</p>`,
    attachments: [publicAttachment(assignmentFileUrl, 'form4-test-assignment-worksheet.pdf')],
  });
  console.log(`Assignment email sent: ${assignmentMail.messageId}`);

  await prisma.assignmentDeliveryRecipient.updateMany({
    where: { assignmentId: assignment.id },
    data: { status: 'sent' },
  });
  await prisma.assignment.update({
    where: { id: assignment.id },
    data: {
      deliveryStatus: 'sent',
      deliverySummary: {
        channel: 'email',
        successCount: 1,
        failureCount: 0,
        totalRecipients: 1,
        sentAt: new Date().toISOString(),
        results: [{ email: testEmail, success: true, messageId: assignmentMail.messageId }],
      },
    },
  });

  console.log('Sending resource email with attachment...');
  const resourceMail = await sendEmail({
    to: testEmail,
    subject: `New learning resource: ${resource.title}`,
    text: `Dear Parent/Guardian,\n\nA Form 4 test resource has been shared for ${getStudentName(student)}.\n\nTitle: ${resource.title}\nSubject: ${resource.subject}\n\nThe resource file is attached.\n\nRegards,\nMatungulu Girls Senior School`,
    html: `<p>Dear Parent/Guardian,</p><p>A <strong>Form 4</strong> test resource has been shared for <strong>${getStudentName(student)}</strong>.</p><p><strong>${resource.title}</strong></p><p>The resource file is attached.</p><p>Regards,<br/>Matungulu Girls Senior School</p>`,
    attachments: [publicAttachment(resourceFileUrl, 'form4-test-resource-formula-sheet.pdf')],
  });
  console.log(`Resource email sent: ${resourceMail.messageId}`);

  await prisma.resourceDeliveryRecipient.updateMany({
    where: { resourceId: resource.id },
    data: { status: 'sent' },
  });
  await prisma.resource.update({
    where: { id: resource.id },
    data: {
      deliveryStatus: 'sent',
      deliverySummary: {
        channel: 'email',
        successCount: 1,
        failureCount: 0,
        totalRecipients: 1,
        sentAt: new Date().toISOString(),
        results: [{ email: testEmail, success: true, messageId: resourceMail.messageId }],
      },
    },
  });

  console.log(JSON.stringify({
    sentTo: testEmail,
    studentId: student.id,
    assignmentId: assignment.id,
    assignmentMessageId: assignmentMail.messageId,
    resourceId: resource.id,
    resourceMessageId: resourceMail.messageId,
  }, null, 2));
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
