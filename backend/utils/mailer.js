const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  // Fallback for local/dev environments
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`OTP for ${email}: ${otp}`);
    return;
  }

  // Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    tls: {
      rejectUnauthorized: false
    }
  });

  // Send OTP mail
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Your Service Booking OTP',

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 520px;
        margin: auto;
        padding: 20px;
      ">
        <h2 style="color: #2563eb;">
          Verify your account
        </h2>

        <p>
          Your OTP for Bookify account verification is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #111827;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP expires in <strong>10 minutes</strong>.
        </p>

        <p style="
          margin-top: 24px;
          color: #6b7280;
        ">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `
  });

  console.log(`OTP email sent successfully to ${email}`);
};

module.exports = { sendOtpEmail };
