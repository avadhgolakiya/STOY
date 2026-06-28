const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER || 'avadhgolakiya88@gmail.com';
  const smtpPass = process.env.SMTP_PASS || 'zvtpdprzfebryjfe';
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

router.post('/', async (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"adultDesire Contact" <${process.env.SMTP_USER || 'avadhgolakiya88@gmail.com'}>`,
      to: 'avadhgolakiya88@gmail.com',
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: 'Montserrat', Arial, sans-serif; background: #0b0112; padding: 40px 16px;">
          <div style="max-width: 560px; margin: 0 auto; background: #150421; border-radius: 20px; overflow: hidden; border: 1px solid rgba(236,72,153,0.2); box-shadow: 0 24px 48px rgba(0,0,0,0.65);">
            <div style="background: linear-gradient(135deg, #4c0519 0%, #db2777 50%, #831843 100%); padding: 36px 32px 28px; text-align: center;">
              <p style="font-size: 22px; font-weight: 700; color: #fff; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-family: Georgia, serif;">adultDesire</p>
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.85); margin: 8px 0 0;">New Contact Form Submission</p>
            </div>
            <div style="padding: 36px 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(236,72,153,0.1); color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; width: 40%;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(236,72,153,0.1); color: #ffffff; font-size: 13px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(236,72,153,0.1); color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Phone</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(236,72,153,0.1); color: #ffffff; font-size: 13px;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">Message</td>
                  <td style="padding: 12px 0; color: #ffffff; font-size: 13px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
              </table>
            </div>
            <div style="padding: 0 32px 28px; text-align: center;">
              <p style="font-size: 10px; color: #4b5563; letter-spacing: 2px; text-transform: uppercase;">© 2026 adultDesire · All Rights Reserved</p>
            </div>
          </div>
        </div>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

module.exports = router;
