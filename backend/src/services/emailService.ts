// import nodemailer from 'nodemailer';

// export class EmailService {
//   private transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: process.env.EMAIL_SERVICE,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });
//   }

//   async sendDownloadLink(email: string, downloadLink: string, expiryTime: string) {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your Ebook Download Link',
//       html: `
//         <h1>Your Download is Ready!</h1>
//         <p>Click the link below to download your ebook:</p>
//         <a href="${downloadLink}">Download Now</a>
//         <p>This link will expire in ${expiryTime}</p>
//         <p>Note: Link can only be used once.</p>
//       `
//     };

//     return await this.transporter.sendMail(mailOptions);
//   }
// }

// src/services/emailService.ts
import nodemailer from 'nodemailer';

interface SendDownloadLinksParams {
  email: string;
  bookTitle: string;
  downloadLinks: {
    PDF?: string;
    EPUB?: string;
  };
  expiryTime: string;
}

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

  async sendDownloadLinks({
    email,
    bookTitle,
    downloadLinks,
    expiryTime
  }: SendDownloadLinksParams): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your ${bookTitle} Download Links`,
      html: `
        <h1>Your Download Links Are Ready!</h1>
        <p>Thank you for purchasing ${bookTitle}!</p>
        
        <h2>Download Links:</h2>
        ${downloadLinks.PDF ? `
          <p><strong>PDF Version:</strong><br>
          <a href="${downloadLinks.PDF}">Download PDF</a></p>
        ` : ''}
        
        ${downloadLinks.EPUB ? `
          <p><strong>EPUB Version:</strong><br>
          <a href="${downloadLinks.EPUB}">Download EPUB</a></p>
        ` : ''}
        
        <p><strong>Important:</strong></p>
        <ul>
          <li>These links will expire in ${expiryTime}</li>
          <li>Each link can only be used once</li>
          <li>Please download your files as soon as possible</li>
        </ul>
        
        <p>If you have any issues, please contact our support team.</p>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}