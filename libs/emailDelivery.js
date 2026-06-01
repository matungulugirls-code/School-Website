import nodemailer from 'nodemailer';

const EMAIL_FROM_NAME = process.env.SCHOOL_NAME || 'Matungulu Girls Senior School';
const EMAIL_FROM_ADDRESS = process.env.EMAIL_USER;

// Configuration for retry logic
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  rateLimit: 100, // Minimum ms between retries for rate limit errors
};

// Rate limit tracking
let lastEmailTime = 0;
let consecutiveErrors = 0;
let rateLimitResetTime = 0;

export const normalizeEmailAddress = (value = '') => {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

const isRateLimitError = (error) => {
  const message = error?.message || String(error);
  const response = error?.response || '';
  
  return (
    message.includes('454') || // Too many login attempts
    message.includes('Too many login attempts') ||
    message.includes('EAUTH') ||
    response.includes('454-4.7.0') ||
    message.includes('please try again later')
  );
};

const isTransientError = (error) => {
  const message = error?.message || String(error);
  
  return (
    isRateLimitError(error) ||
    message.includes('ETIMEDOUT') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ECONNRESET') ||
    message.includes('timeout') ||
    message.includes('temporarily unavailable')
  );
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const calculateDelay = (attempt, isRateLimitError = false) => {
  if (isRateLimitError) {
    // For rate limit errors, use longer delays
    return Math.min(
      RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt + 1),
      RETRY_CONFIG.maxDelay
    );
  }
  
  // For other errors, use exponential backoff
  return Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
    RETRY_CONFIG.maxDelay
  );
};

const respeitRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastEmail = now - lastEmailTime;
  
  if (timeSinceLastEmail < RETRY_CONFIG.rateLimit) {
    await sleep(RETRY_CONFIG.rateLimit - timeSinceLastEmail);
  }
  
  // Check if we're in rate limit cool-down period
  if (now < rateLimitResetTime) {
    const waitTime = rateLimitResetTime - now;
    console.warn(`Rate limit cool-down: waiting ${waitTime}ms`);
    await sleep(waitTime);
  }
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
    pool: {
      maxConnections: 1, // Limit connections to avoid overwhelming Gmail
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 10, // 10 emails per second max
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

  let lastError = null;
  let attempt = 0;

  while (attempt < RETRY_CONFIG.maxRetries) {
    try {
      // Respect rate limiting
      await respeitRateLimit();

      const transporter = getEmailTransporter();
      const result = await transporter.sendMail({
        from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM_ADDRESS}>`,
        to: normalizedTo,
        subject,
        text,
        html,
        attachments,
      });

      // Reset error counters on success
      lastEmailTime = Date.now();
      consecutiveErrors = 0;

      return {
        success: true,
        email: normalizedTo,
        provider: 'email',
        messageId: result.messageId,
        result,
        timestamp: new Date().toISOString(),
        attempts: attempt + 1,
      };
    } catch (error) {
      lastError = error;
      const isRateLimit = isRateLimitError(error);
      const isTransient = isTransientError(error);

      console.error(
        `Email delivery attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries} failed:`,
        {
          email: normalizedTo,
          error: error?.message,
          code: error?.code,
          responseCode: error?.responseCode,
          isRateLimit,
          isTransient,
        }
      );

      // If this is a rate limit error, increase cool-down time
      if (isRateLimit) {
        consecutiveErrors++;
        // Set cool-down for exponentially longer periods
        const coolDownDuration = Math.min(
          30000 * Math.pow(2, consecutiveErrors - 1),
          300000 // Max 5 minutes
        );
        rateLimitResetTime = Date.now() + coolDownDuration;
        console.warn(
          `Gmail rate limit detected. Setting cool-down for ${coolDownDuration}ms`
        );
      }

      // Only retry on transient errors
      if (!isTransient || attempt >= RETRY_CONFIG.maxRetries - 1) {
        break;
      }

      // Calculate delay for next retry
      const delayMs = calculateDelay(attempt, isRateLimit);
      console.log(
        `Retrying in ${delayMs}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`
      );
      await sleep(delayMs);
      attempt++;
    }
  }

  // All retries exhausted
  return {
    success: false,
    error: lastError?.message || 'Failed to send email after retries',
    email: normalizedTo,
    code: lastError?.code,
    responseCode: lastError?.responseCode,
    attempts: attempt + 1,
  };
};
