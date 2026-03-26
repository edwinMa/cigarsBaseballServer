require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
}

async function send({ to, subject, text, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email not configured. Skipping email to:', to);
    console.warn('Email body:', text);
    return;
  }
  try {
    const t = getTransporter();
    await t.sendMail({
      from: process.env.SMTP_FROM || `"Cigars Baseball" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
    console.warn('>>> LOGIN CODE FOR', to, ':', text);
    // Don't rethrow — allow login to proceed even if email fails
  }
}

module.exports = { send };
