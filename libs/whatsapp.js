import africastalking from 'africastalking';

const normalizeLocalMobilePhone = (value = '') => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return null;
  if (/^07\d{8}$/.test(digits)) return digits;
  if (/^7\d{8}$/.test(digits)) return `0${digits}`;
  if (/^2547\d{8}$/.test(digits)) return `0${digits.slice(3)}`;
  if (/^254\d{9}$/.test(digits)) return `0${digits.slice(3)}`;
  return null;
};

export const normalizePhoneNumber = (phone) => normalizeLocalMobilePhone(phone);

export const toE164PhoneNumber = (phone) => {
  const normalized = normalizeLocalMobilePhone(phone);
  if (!normalized) return null;
  const digits = normalized.replace(/\D/g, '');
  if (/^07\d{8}$/.test(digits)) {
    return `+254${digits.slice(1)}`;
  }
  if (/^2547\d{8}$/.test(digits)) {
    return `+${digits}`;
  }
  return null;
};

const getAfricaTalkingClient = () => {
  const username = process.env.AT_USERNAME?.trim();
  const apiKey = process.env.AT_API_KEY?.trim();

  if (!username || !apiKey) {
    throw new Error('Africa\'s Talking credentials are not configured. Set AT_USERNAME and AT_API_KEY.');
  }

  return africastalking({ apiKey, username });
};

const resolveMessagingService = (client) => {
  if (client.WhatsApp) return client.WhatsApp;
  if (client.Messaging) return client.Messaging;
  if (client.SMS) return client.SMS;
  if (client.Sms) return client.Sms;
  throw new Error('No supported Africa\'s Talking messaging service was found.');
};

const buildPayload = (service, to, message, from) => {
  const payload = {
    to: [to],
    message,
  };

  if (from) {
    payload.from = from;
  }

  return payload;
};

export const sendWhatsAppMessage = async (phoneNumber, message) => {
  const e164 = toE164PhoneNumber(phoneNumber);
  if (!e164) {
    return {
      success: false,
      error: 'Invalid phone number format',
      phoneNumber,
    };
  }

  try {
    const client = getAfricaTalkingClient();
    const service = resolveMessagingService(client);
    const from = process.env.AT_SENDER_ID?.trim();
    const payload = buildPayload(service, e164, message, from);

    const result = await service.send(payload);
    const success = Boolean(result && (result.length || result.status || result.SMSMessageData || result.messages));

    return {
      success: success !== false,
      phoneNumber: e164,
      provider: service === client.WhatsApp ? 'WhatsApp' : 'SMS',
      sender: from || null,
      result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error sending WhatsApp message via Africa\'s Talking:', error);
    return {
      success: false,
      error: error?.message || String(error),
      phoneNumber: e164,
    };
  }
};
