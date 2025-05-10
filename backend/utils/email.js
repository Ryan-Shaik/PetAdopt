const nodemailer = require('nodemailer');
    require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded relative to this file if run standalone, but server.js load is primary

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g., 'gmail', 'sendgrid'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // App password for Gmail if 2FA is on
        },
        // Add additional options if needed, e.g., for SendGrid API key
    });

    /**
     * Sends an email.
     * @param {string} to Recipient email address.
     * @param {string} subject Email subject.
     * @param {string} text Plain text body.
     * @param {string} html HTML body.
     */
    const sendEmail = async ({ to, subject, text, html }) => {
        const mailOptions = {
            from: process.env.EMAIL_FROM, // Sender address (e.g., '"Your App" <noreply@example.com>')
            to: to,
            subject: subject,
            text: text, // Plain text body
            html: html, // HTML body
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            // Preview URL only available for Ethereal transport
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    };

    module.exports = sendEmail;