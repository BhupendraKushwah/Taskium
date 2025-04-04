// In your email sending file (e.g., emailService.js)
const { transporter, mailConfig } = require('../config/mailer');
const fs = require('fs').promises;
const path = require('path');

const sendWelcomeEmail = async (toEmail, userName) => {
    try {
        const templatePath = path.join(__dirname, '../templates/WelcomeEmailPreview.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf8');

        // Replace placeholders with dynamic data
        htmlTemplate = htmlTemplate
            .replace('[USER_NAME]', userName)
            .replace('[USER_EMAIL]', toEmail);

        // Plain text fallback
        const textContent = `
      Hello ${userName},

      Thanks for joining Taskium! We’re excited to have you on board.
      Our platform is designed to help you manage tasks efficiently and stay organized.

      Get started: http://localhost:5173/

      Taskium
    `;

        // Email options
        const mailOptions = {
            from: '"Taskium Team" <your-email@yourdomain.com>',
            to: toEmail,
            subject: 'Welcome to Taskium!',
            html: htmlTemplate,
            text: textContent // Fallback for clients that don’t render HTML
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendPasswordResetLink = async (toEmail, userName, link) => {
    try {
        const templatePath = path.join(__dirname, '../templates/forgot-password.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

        // Replace placeholders with dynamic data
        htmlTemplate = htmlTemplate
            .replace('[USER_NAME]', userName)
            .replace('[RESET_LINK]', link);
        const mailOptions = {
            from: '"Taskium Team" <your-email@yourdomain.com>',
            to: toEmail,
            subject: 'Password Reset!',
            html: htmlTemplate,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = { sendWelcomeEmail, sendPasswordResetLink };