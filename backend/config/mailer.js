// config/nodemailerConfig.js

const nodemailer = require('nodemailer');

const mailConfig = {
    // Transport configuration
    transporter: {
        // Email service provider (e.g., Gmail, SendGrid, etc.)
        service: process.env.EMAIL_SERVICE || 'gmail',
        
        // Host configuration (uncomment and use if not using a service)
        /*
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE || false, // true for 465, false for other ports
        */
        
        // Authentication credentials
        auth: {
            user: process.env.EMAIL_USER,      // Your email address
            pass: process.env.EMAIL_PASSWORD   // Your email password or app-specific password
        }
    },

    // Default email options
    defaults: {
        from: {
            name: process.env.EMAIL_FROM_NAME || 'Your App Name',
            address: process.env.EMAIL_USER
        }
    },

    // Email templates configuration (optional)
    templates: {
        directory: './emails/templates', // Directory for email templates if you're using them
        defaultSubject: 'Welcome to Our Service'
    }
};

// Create and configure the transporter
const transporter = nodemailer.createTransport({
    ...mailConfig.transporter,
    pool: true, // Use connection pooling
    maxConnections: 5, // Max number of connections
    maxMessages: 100 // Max messages per connection
});

// Verify the transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error);
    }
});

// Export the configured transporter and mailConfig
module.exports = {
    transporter,
    mailConfig
};