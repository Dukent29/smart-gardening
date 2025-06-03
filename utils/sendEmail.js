const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: 587,
            secure: false, // true for port 465, false for 587
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or App Password
            },
        });

        const mailOptions = {
            from: `"SmartGarden" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[DEBUG] Email sent:', info.messageId);
    } catch (err) {
        console.error('[ERROR] Sending Email:', err);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
