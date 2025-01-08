// import nodemailer from 'nodemailer';

// export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'brajdhakad0@gmail.com',
//       pass: 'aptv ipfh vomv ikmi',
//     },
//   });

//   const mailOptions = {
//     from: 'brajdhakad0@gmail.com',
//     to,
//     subject,
//     text: body,
//   };

//   await transporter.sendMail(mailOptions);
// };

import nodemailer, { Transporter } from 'nodemailer';

export class EmailService {
  public transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  public async sendDownloadLink(
    to: string,
    downloadToken: string,
  ): Promise<void> {
    const subject = 'Your Download Link';
    const downloadUrl = `${process.env.APP_URL}/download/${downloadToken}`;

    const body = `
     Thank you for your purchase!
     Download link: ${downloadUrl}
     This link will expire in 24 hours.
   `;

    await this.sendEmail(to, subject, body);
  }

  public async sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();