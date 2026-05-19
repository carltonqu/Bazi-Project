import nodemailer from 'nodemailer';

// Resend API configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bazi-frontend-gray.vercel.app';

// Create email transporter (fallback to Gmail if Resend not configured)
const createTransporter = () => {
  // Use Gmail SMTP or other service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email using Resend API
async function sendWithResend(to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Bazi Fortune Teller <${RESEND_FROM_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}

export async function sendVerificationEmail(email, name, verificationToken) {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: #0a0a12; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #d4af37; margin: 0; font-size: 28px;">八字 Bazi</h1>
        <p style="color: #fff; margin: 10px 0 0 0;">Fortune Teller</p>
      </div>
      <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Hello ${name},</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Thank you for signing up! Please verify your email address to complete your registration and start discovering your destiny.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #d4af37 0%, #f59e0b 100%); 
                    color: #0a0a12; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    display: inline-block;">
            Verify My Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Or copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #d4af37; word-break: break-all;">${verificationUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  // Try Resend first
  if (RESEND_API_KEY) {
    try {
      await sendWithResend(email, 'Verify Your Email - Bazi Fortune Teller', htmlContent);
      return { success: true };
    } catch (error) {
      console.error('Resend failed, falling back:', error.message);
      // Fall through to fallback methods
    }
  }

  // Try Gmail/Nodemailer
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Bazi Fortune Teller" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Bazi Fortune Teller',
        html: htmlContent,
      });
      return { success: true };
    } catch (error) {
      console.error('Gmail fallback failed:', error.message);
    }
  }

  // Development mode fallback (local only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('========================================');
    console.log('EMAIL VERIFICATION (Development Mode)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Verification Token: ${verificationToken}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('========================================');
    return { success: true, devMode: true };
  }

  // Production: fail explicitly when no email provider is configured
  return {
    success: false,
    error: 'No email provider configured. Set RESEND_API_KEY or EMAIL_USER/EMAIL_PASS.',
  };
}
