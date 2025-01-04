import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
    }
});

const domain = process.env.NODE_ENV === "development"
    ? 'http://localhost:5173'
    : 'https://fullstack-chat-app-99xq.onrender.com';

export async function sendEmailVerificationEmail(to, username, linkId) {
    const info = await transporter.sendMail({
        to: to,
        from: '"The PingMe App" | <thepringmeapp@gmail.com>',
        subject: 'Verify your email address',
        html: verifyYourEmailEmailBody(username, linkId)
    })
}

function verifyYourEmailEmailBody(username, linkId) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        /* General Styling */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f7fc;
          margin: 0;
          padding: 0;
        }
        .email-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .email-header {
          background-color: #3498db;
          padding: 20px;
          text-align: center;
          color: #ffffff;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-content {
          padding: 20px;
        }
        .email-content h2 {
          font-size: 22px;
          color: #333;
        }
        .email-content p {
          font-size: 16px;
          line-height: 1.5;
          color: #555;
        }
        .verify-button {
          display: inline-block;
          background-color: #3498db;
          color: #ffffff;
          font-size: 16px;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          text-align: center;
        }
        .verify-button:hover {
          background-color: #2980b9;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 15px;
          text-align: center;
          font-size: 14px;
          color: #888;
        }
        .footer a {
          color: #3498db;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
    
      <div class="email-container">
        <!-- Email Header -->
        <div class="email-header">
          <h1>Verify Your Email Address</h1>
        </div>
    
        <!-- Email Content -->
        <div class="email-content">
          <h2>Hello ${username || "there"}!,</h2>
          <p>Thank you for signing up for PingMe. To complete your registration, we need to verify your email address.</p>
          <p>Please click the button below to verify your email and activate your account:</p>
    
          <a href="${domain}/verify?linkId=${linkId}" class="verify-button">Verify Your Email</a>
    
          <p>If you didn’t sign up for PingMe, please ignore this email. Your account won’t be activated.</p>
        </div>
    
        <!-- Email Footer -->
        <div class="footer">
          <p>If you have any questions, feel free to <a href="mailto:support@[yourdomain].com">contact our support team</a>.</p>
          <p>&copy; ${new Date().getFullYear()} PingMe. All rights reserved.</p>
        </div>
      </div>
    
    </body>
    </html>
    `
}