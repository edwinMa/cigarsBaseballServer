require('dotenv').config();

let twilioClient;

function getClient() {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) return null;
    const twilio = require('twilio');
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

// Returns the created Twilio message (with .sid and .status), or null when SMS
// isn't configured. Throws if Twilio rejects the request.
async function send(to, body) {
  const client = getClient();
  if (!client) {
    console.warn('SMS not configured. Skipping SMS to:', to);
    console.warn('>>> SMS BODY:', body);
    return null;
  }
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!from) {
    console.warn('Missing TWILIO_FROM_NUMBER. Skipping SMS to:', to);
    return null;
  }
  // Normalize phone: ensure +1 prefix for US numbers if not already international
  let toNumber = to.replace(/\D/g, '');
  if (toNumber.length === 10) toNumber = '+1' + toNumber;
  else if (!toNumber.startsWith('+')) toNumber = '+' + toNumber;

  const params = { from, to: toNumber, body };
  // Ask Twilio to POST delivery updates so we can record true delivery status.
  const base = process.env.PUBLIC_BASE_URL || 'https://cigarsbaseballserver.herokuapp.com';
  if (base) params.statusCallback = `${base.replace(/\/$/, '')}/cigarsbaseball/webhook/twilio-status`;

  return client.messages.create(params);
}

module.exports = { send };
