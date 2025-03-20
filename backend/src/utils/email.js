const nodemailer = require("nodemailer");

// Create email templates
const createEmailTemplate = (content) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: translateY(-1px);
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f3f4f6;
            color: #6b7280;
            font-size: 14px;
          }
          .social-links {
            margin-top: 15px;
          }
          .social-links a {
            color: #6b7280;
            text-decoration: none;
            margin: 0 10px;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
              width: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HandsOn</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} HandsOn. All rights reserved.</p>
            <p>If you didn't request this email, please ignore it.</p>
            <div class="social-links">
              <a href="#">Twitter</a>
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Create verification email template
const createVerificationEmailTemplate = (verificationUrl) => {
  return createEmailTemplate(`
    <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to HandsOn!</h2>
    <p style="margin-bottom: 20px;">Thank you for joining our community of volunteers. To get started, please verify your email address by clicking the button below:</p>
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
    </div>
    <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">This link will expire in 24 hours. If you need a new verification link, please log in and request one from your profile settings.</p>
  `);
};

// Create password reset email template
const createPasswordResetTemplate = (resetUrl) => {
  return createEmailTemplate(`
    <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>
    <p style="margin-bottom: 20px;">You recently requested to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">This link will expire in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
  `);
};

// Create welcome email template
const createWelcomeTemplate = (name) => {
  return createEmailTemplate(`
    <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to HandsOn, ${name}!</h2>
    <p style="margin-bottom: 20px;">We're excited to have you join our community of volunteers making a difference in the world.</p>
    <h3 style="color: #4b5563; margin: 20px 0;">Here's what you can do next:</h3>
    <ul style="list-style-type: none; padding: 0; margin: 0 0 20px 0;">
      <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
        ✨ Complete your profile
      </li>
      <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
        🔍 Browse volunteer opportunities
      </li>
      <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
        👥 Join or create a team
      </li>
      <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
        🌟 Start making an impact
      </li>
    </ul>
    <div style="text-align: center;">
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
    </div>
  `);
};

// Send email function
const sendEmail = async (options) => {
  try {
    // Create transporter with Gmail-specific configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      debug: true, // Enable debug logs
      logger: true, // Enable logger
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP Verification Error:", verifyError);
      throw new Error(
        "Failed to verify SMTP connection: " + verifyError.message
      );
    }

    // Determine email template based on type
    let html;
    switch (options.type) {
      case "verification":
        html = createVerificationEmailTemplate(options.url);
        break;
      case "reset":
        html = createPasswordResetTemplate(options.url);
        break;
      case "welcome":
        html = createWelcomeTemplate(options.name);
        break;
      default:
        html = createEmailTemplate(options.html);
    }

    // Send email with more detailed options
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME,
        address: process.env.FROM_EMAIL,
      },
      to: options.email,
      subject: options.subject,
      html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return info;
    } catch (sendError) {
      console.error("Email Send Error:", sendError);
      throw new Error("Failed to send email: " + sendError.message);
    }
  } catch (error) {
    console.error("Detailed email error:", error);
    // Don't throw the error, just log it and return false
    // This prevents the registration process from failing if email fails
    return false;
  }
};

module.exports = {
  sendEmail,
};
