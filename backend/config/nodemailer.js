import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter on startup (optional)
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email transporter ready');
  }
});

// Send OTP email
export const sendOTPMail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: '🔐 Your OTP Verification Code - Auth App',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0d1117;
            color: #c9d1d9;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #161b22 0%, #0d1620 100%);
            border: 1px solid #30363d;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .header {
            background: linear-gradient(135deg, #58a6ff 0%, #1f6feb 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 { font-size: 28px; font-weight: 700; margin: 0; }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .otp-box {
            background: linear-gradient(135deg, #0f1520 0%, #1a2332 100%);
            border: 2px solid #58a6ff;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            letter-spacing: 8px;
          }
          .otp-code {
            font-size: 42px;
            font-weight: 700;
            color: #58a6ff;
            font-family: 'Courier New', monospace;
          }
          .info-text {
            color: #8b949e;
            font-size: 14px;
            margin: 20px 0;
          }
          .warning {
            background: rgba(248, 81, 73, 0.1);
            border-left: 4px solid #f85149;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #ffcbd2;
            text-align: left;
            font-size: 13px;
          }
          .footer {
            padding: 20px 30px;
            background: #0d1117;
            border-top: 1px solid #30363d;
            font-size: 12px;
            color: #8b949e;
            text-align: center;
          }
          .social {
            margin: 20px 0;
          }
          a { color: #58a6ff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          @media (max-width: 640px) {
            .container { margin: 10px; }
            .content { padding: 30px 20px; }
            .otp-code { font-size: 32px; letter-spacing: 6px; }
            .header { padding: 30px 15px; }
            .header h1 { font-size: 22px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 OTP Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p style="color: #c9d1d9; margin: 15px 0;">Your OTP for email verification is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p class="info-text">⏱️ This code expires in <strong>5 minutes</strong></p>
            <div class="warning">
              ⚠️ Never share this code with anyone. Our team will never ask for your OTP.
            </div>
            <p style="color: #8b949e; margin: 20px 0; font-size: 14px;">
              If you didn't request this code, please <a href="mailto:${process.env.SMTP_FROM}">contact us</a> immediately.
            </p>
          </div>
          <div class="footer">
            <p>© 2026 Auth App. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', email);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeMail = async (email, name) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: '🎉 Welcome to Auth App - Your Account is Ready!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Auth App</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0d1117;
            color: #c9d1d9;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #161b22 0%, #0d1620 100%);
            border: 1px solid #30363d;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .header {
            background: linear-gradient(135deg, #2ea043 0%, #1c7c2f 100%);
            padding: 50px 20px;
            text-align: center;
            color: white;
          }
          .header h1 { font-size: 32px; font-weight: 700; margin: 0; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #f0f6fc;
            margin-bottom: 20px;
          }
          .features {
            background: #0f1520;
            border-left: 4px solid #58a6ff;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
          }
          .feature-title {
            color: #58a6ff;
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .feature-list {
            list-style: none;
            padding: 0;
          }
          .feature-list li {
            padding: 8px 0;
            color: #c9d1d9;
            font-size: 14px;
            padding-left: 25px;
            position: relative;
          }
          .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #2ea043;
            font-weight: bold;
            font-size: 16px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #58a6ff 0%, #1f6feb 100%);
            color: white;
            padding: 14px 35px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 25px 0;
            transition: transform 0.2s;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .info-section {
            background: rgba(88, 166, 255, 0.08);
            border: 1px solid rgba(88, 166, 255, 0.2);
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            font-size: 14px;
            color: #96c1ff;
          }
          .footer {
            padding: 25px 30px;
            background: #0d1117;
            border-top: 1px solid #30363d;
            font-size: 12px;
            color: #8b949e;
            text-align: center;
          }
          .footer-links {
            margin: 15px 0;
          }
          .footer-links a {
            color: #58a6ff;
            text-decoration: none;
            margin: 0 10px;
            font-size: 12px;
          }
          .divider {
            height: 1px;
            background: #30363d;
            margin: 15px 0;
          }
          @media (max-width: 640px) {
            .container { margin: 10px; }
            .content { padding: 30px 20px; }
            .header { padding: 40px 15px; }
            .header h1 { font-size: 26px; }
            .cta-button { width: 100%; text-align: center; }
            .features { padding: 20px; }
            .footer-links { display: block; }
            .footer-links a { display: block; margin: 8px 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome, ${name}!</h1>
            <p>Your account is ready to use</p>
          </div>
          <div class="content">
            <p class="greeting">Hi ${name},</p>
            <p>Thank you for joining <strong>Auth App</strong>! Your email has been verified and your account is now active.</p>
            
            <div class="features">
              <div class="feature-title">✨ You can now:</div>
              <ul class="feature-list">
                <li>Access your secure dashboard</li>
                <li>Manage your account settings</li>
                <li>Reset your password anytime</li>
                <li>Update your profile information</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3000" class="cta-button">📱 Launch Dashboard</a>
            </div>

            <div class="info-section">
              <strong>🔒 Account Security:</strong><br>
              We recommend enabling two-factor authentication for enhanced security. Never share your password with anyone.
            </div>

            <p style="color: #8b949e; font-size: 14px; margin: 20px 0;">
              If you have any questions or need assistance, feel free to reach out to our support team.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0;">© 2026 Auth App. All rights reserved.</p>
            <div class="divider"></div>
            <div class="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Support</a>
            </div>
            <p style="margin: 15px 0 0 0; color: #6e7681;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', email);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export default transporter;

// Send registration confirmation email
export const sendRegistrationConfirmationMail = async (email, name) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: '📧 Confirm Your Registration - Auth App',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Confirmation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0d1117;
            color: #c9d1d9;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #161b22 0%, #0d1620 100%);
            border: 1px solid #30363d;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .header {
            background: linear-gradient(135deg, #1f6feb 0%, #0969da 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 { font-size: 28px; font-weight: 700; margin: 0; }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #f0f6fc;
            margin-bottom: 20px;
          }
          .account-info {
            background: #0f1520;
            border-left: 4px solid #1f6feb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            font-size: 14px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #30363d;
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #8b949e; }
          .info-value { color: #58a6ff; font-weight: 600; }
          .next-step {
            background: rgba(46, 160, 67, 0.1);
            border: 1px solid rgba(46, 160, 67, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #2ea043;
          }
          .next-step-title {
            color: #2ea043;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .next-step p {
            color: #8be9a8;
            font-size: 14px;
            margin: 5px 0;
          }
          .footer {
            padding: 25px 30px;
            background: #0d1117;
            border-top: 1px solid #30363d;
            font-size: 12px;
            color: #8b949e;
            text-align: center;
          }
          @media (max-width: 640px) {
            .container { margin: 10px; }
            .content { padding: 30px 20px; }
            .header { padding: 30px 15px; }
            .info-row { flex-direction: column; }
            .info-label:after { content: ": "; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Registration Successful!</h1>
          </div>
          <div class="content">
            <p class="greeting">Hello ${name},</p>
            <p>Thank you for creating an account with <strong>Auth App</strong>. We're excited to have you on board!</p>

            <div class="account-info">
              <div class="info-row">
                <span class="info-label">Account Name:</span>
                <span class="info-value">${name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email Address:</span>
                <span class="info-value">${email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">Pending Verification</span>
              </div>
            </div>

            <div class="next-step">
              <div class="next-step-title">✓ What's Next?</div>
              <p>An OTP verification code has been sent to your email. Please check your inbox (or spam folder) and enter the 6-digit code to verify your email address.</p>
              <p style="margin-top: 10px; font-size: 13px;">⏱️ The code expires in <strong>5 minutes</strong>.</p>
            </div>

            <p style="color: #8b949e; font-size: 14px; margin: 20px 0;">
              If you didn't create this account, please <a href="mailto:${process.env.SMTP_FROM}" style="color: #58a6ff;">contact us</a> immediately.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0;">© 2026 Auth App. All rights reserved.</p>
            <p style="margin: 10px 0 0 0;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Registration confirmation email sent:', email);
    return info;
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    throw error;
  }
};


