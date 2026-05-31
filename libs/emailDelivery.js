import nodemailer from 'nodemailer';

const EMAIL_FROM_NAME = process.env.SCHOOL_NAME || 'Matungulu Girls Senior School';
const EMAIL_FROM_ADDRESS = process.env.EMAIL_USER;

export const normalizeEmailAddress = (value = '') => {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

const getEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS.');
  }

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendDeliveryEmail = async ({ to, subject, text, html, attachments = [] }) => {
  const normalizedTo = normalizeEmailAddress(to);
  if (!normalizedTo) {
    return {
      success: false,
      error: 'Invalid email address',
      email: to,
    };
  }

  try {
    const transporter = getEmailTransporter();
    const result = await transporter.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM_ADDRESS}>`,
      to: normalizedTo,
      subject,
      text,
      html,
      attachments,
    });

    return {
      success: true,
      email: normalizedTo,
      provider: 'email',
      messageId: result.messageId,
      result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error sending delivery email:', error);
    return {
      success: false,
      error: error?.message || String(error),
      email: normalizedTo,
    };
  }
};
