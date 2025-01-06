// src/services/email.service.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendBookLink(email, downloadToken, bookTitle) {
        const downloadUrl = `${process.env.APP_URL}/api/downloads/${downloadToken}`;
        
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: `Your Download Link for ${bookTitle}`,
            html: `
                <h2>Thank you for your purchase!</h2>
                <p>Click the link below to download your book:</p>
                <a href="${downloadUrl}">Download ${bookTitle}</a>
                <p>This link will expire in 24 hours.</p>
            `
        });
    }
}

module.exports = new EmailService();