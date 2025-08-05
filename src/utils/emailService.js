const nodemailer = require('nodemailer');
const { ApiError } = require('../errors/errorHandler');

/**
 * Email service for sending verification codes, password reset links, etc.
 */
class EmailService {
  constructor() {
    // Use Gmail as default email provider
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER || 'arifishtiaque.sparktech@gmail.com',
        pass: process.env.EMAIL_PASS || 'etnynjlbjeongxfe'
      },
      tls: {
        rejectUnauthorized: false
      }
    };

    // Log a warning if using default values (which won't work without proper configuration)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Warning: Using default email configuration values. Email sending will not work until proper credentials are set in environment variables.');
      console.warn('Please set the following environment variables:');
      console.warn('EMAIL_USER=your-email@gmail.com');
      console.warn('EMAIL_PASS=your-app-specific-password');
    }

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  /**
   * Send verification code email
   * @param {string} to - Recipient email
   * @param {string} code - Verification code
   * @returns {Promise<boolean>} - Success status
   */
  async sendVerificationCode(to, code) {
    try {
      const mailOptions = {
        from: `"${process.env.SERVICE_NAME}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject: 'Email Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FFBA00; border-radius: 5px;">
            <h2 style="color:rgb(12, 10, 3);">Verify Your Email</h2>
            <p>Thank you for registering with ${process.env.SERVICE_NAME}. Please use the following code to verify your email address:</p>
            <div style="background-color: #FFBA00; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Best regards,<br>The ${process.env.SERVICE_NAME} Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new ApiError('Failed to send verification email', 500);
    }
  }

  /**
   * Send password reset email
   * @param {string} to - Recipient email
   * @param {string} code - Reset code
   * @returns {Promise<boolean>} - Success status
   */
  async sendPasswordResetCode(to, code) {
    try {
      const mailOptions = {
        from: `"${process.env.SERVICE_NAME}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject: 'Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FFBA00; border-radius: 5px;">
            <h2 style="color:rgb(12, 10, 3);">Reset Your Password</h2>
            <p>We received a request to reset your password. Please use the following code to reset your password:</p>
            <div style="background-color: #FFBA00; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
            <p>Best regards,<br>The ${process.env.SERVICE_NAME} Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new ApiError('Failed to send password reset email', 500);
    }
  }

  /**
   * Send welcome email after successful registration
   * @param {string} to - Recipient email
   * @param {string} name - User's name
   * @param {string} role - User's role (user or owner)
   * @returns {Promise<boolean>} - Success status
   */
  async sendWelcomeEmail(to, name, role) {
    try {
      const roleSpecificText = role === 'owner' 
        ? `Thank you for registering your business with ${process.env.SERVICE_NAME}. We\'re excited to have you as a service provider!`
        : `Thank you for joining ${process.env.SERVICE_NAME}. We\'re excited to help you connect with pet services!`;

      const mailOptions = {
        from: `"${process.env.SERVICE_NAME}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject: `Welcome to ${process.env.SERVICE_NAME}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FFBA00; border-radius: 5px;">
            <h2 style="color:rgb(12, 10, 3);">Welcome to ${process.env.SERVICE_NAME}!</h2>
            <p>Hello ${name},</p>
            <p>${roleSpecificText}</p>
            <p>You can now log in to your account and start using our services.</p>
            <p>Best regards,<br>The ${process.env.SERVICE_NAME} Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw an error for welcome emails as they're not critical
      return false;
    }
  }
}

module.exports = new EmailService();
