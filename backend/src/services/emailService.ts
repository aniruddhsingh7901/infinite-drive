import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendDownloadLink(email: string, downloadLink: string, expiryTime: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Ebook Download Link',
      html: `
        <h1>Your Download is Ready!</h1>
        <p>Click the link below to download your ebook:</p>
        <a href="${downloadLink}">Download Now</a>
        <p>This link will expire in ${expiryTime}</p>
        <p>Note: Link can only be used once.</p>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }
}