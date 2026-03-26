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

async function send(to, body) {
  const client = getClient();
  if (!client) {
    console.warn('SMS not configured (missing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN). Skipping SMS to:', to);
    return;
  }
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!from) {
    console.warn('Missing TWILIO_FROM_NUMBER. Skipping SMS to:', to);
    return;
  }
  // Normalize phone: ensure +1 prefix for US numbers if not already international
  let toNumber = to.replace(/\D/g, '');
  if (toNumber.length === 10) toNumber = '+1' + toNumber;
  else if (!toNumber.startsWith('+')) toNumber = '+' + toNumber;

  await client.messages.create({ from, to: toNumber, body });
}

module.exports = { send };
