import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter();

    if (!transporter) {
      console.warn(`[SMTP Warning] SMTP credentials not fully configured in environment. Fallback: Email to ${to} subject "${subject}".`);
      return { success: true };
    }

    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@notesstudy.online';
    const fromName = 'Notes Study Verification';

    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      replyTo
    });

    return { success: true };
  } catch (err: any) {
    console.error('Email Dispatch Error:', err.message);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

export async function sendDeviceVerificationOtp(email: string, studentName: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Device Verification Code</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F9FC; margin: 0; padding: 20px; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
        .header { background: #010E38; padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; }
        .header p { margin: 4px 0 0 0; font-size: 11px; color: #0071D1; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 32px 28px; color: #334155; line-height: 1.6; }
        .otp-box { background: #F7F9FC; border: 2px dashed #005CBF; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #010E38; font-family: monospace; }
        .notice { font-size: 12px; color: #64748B; margin-top: 20px; border-top: 1px solid #E2E8F0; padding-top: 16px; }
        .footer { background: #F7F9FC; padding: 16px 24px; text-align: center; font-size: 11px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Notes Study</h1>
          <p>Security & Device Authorization</p>
        </div>
        <div class="content">
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>A new device is attempting to log into your Notes Study student account. Under our account security policy, new devices require one-time email authorization before access is granted.</p>
          
          <div class="otp-box">
            <div style="font-size: 11px; font-weight: 700; color: #005CBF; text-transform: uppercase; margin-bottom: 6px;">Your One-Time Passcode (OTP)</div>
            <div class="otp-code">${otp}</div>
            <div style="font-size: 11px; color: #FC7600; font-weight: 600; margin-top: 6px;">Expires in 10 minutes • Single-use only</div>
          </div>

          <p style="font-size: 12px; color: #475569;">If this was you, enter this 6-digit code on your login screen to approve this second device. If you did not attempt this login, we recommend changing your password immediately.</p>

          <div class="notice">
            <strong>Security Notice:</strong> Notes Study enforces a maximum limit of 2 authorized devices within any 48-hour rolling period to protect student libraries from unauthorized sharing.
          </div>
        </div>
        <div class="footer">
          © 2026 Notes Study (notesstudy.online) · Learn • Practice • Grow
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `${otp} is your Notes Study Device Verification Code`,
    html,
    text: `Your Notes Study one-time verification code is: ${otp}. This code expires in 10 minutes and is single-use only.`
  });
}

export async function sendContactEnquiryEmail({
  name,
  email,
  mobile,
  subject,
  description
}: {
  name: string;
  email: string;
  mobile: string;
  subject: string;
  description: string;
}): Promise<{ success: boolean; error?: string }> {
  const contactRecipient = process.env.CONTACT_EMAIL || 'nstudy620@gmail.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Student Enquiry</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F9FC; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
        .header { background: #010E38; padding: 24px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 18px; font-weight: 800; }
        .content { padding: 28px; color: #334155; line-height: 1.6; }
        .field { margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
        .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #005CBF; letter-spacing: 0.5px; }
        .val { font-size: 14px; font-weight: 600; color: #0F172A; margin-top: 4px; }
        .desc-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; font-size: 13px; color: #334155; white-space: pre-wrap; line-height: 1.6; margin-top: 6px; }
        .footer { background: #F7F9FC; padding: 14px 24px; text-align: center; font-size: 11px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Notes Study • New Contact Enquiry</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Student Name</div>
            <div class="val">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email Address</div>
            <div class="val"><a href="mailto:${email}">${email}</a></div>
          </div>
          <div class="field">
            <div class="label">Mobile Number</div>
            <div class="val">${mobile}</div>
          </div>
          <div class="field">
            <div class="label">Subject / Topic</div>
            <div class="val">${subject}</div>
          </div>
          <div class="field" style="border-bottom: none;">
            <div class="label">Problem or Question Description</div>
            <div class="desc-box">${description}</div>
          </div>
        </div>
        <div class="footer">
          Received via Notes Study Contact Us Form · notesstudy.online
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: contactRecipient,
    replyTo: email,
    subject: `[Notes Study Enquiry] ${subject} - from ${name}`,
    html,
    text: `New Student Enquiry:\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nSubject: ${subject}\n\nDescription:\n${description}`
  });
}

