import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  public async sendDownloadLink(
    to: string,
    downloadLinks: { pdf: string; epub: string },
    txHash: string
  ): Promise<void> {
    const subject = 'Your Book Download Links';
    const body = `
            Thank you for your purchase!
            
            Your download links (valid for 24 hours):
            
            PDF Version: ${downloadLinks.pdf}
            EPUB Version: ${downloadLinks.epub}
            
            Transaction Hash: ${txHash}
            
            Note: Each link can only be used once.
        `;

    await this.sendEmail(to, subject, body);
  }

  public async sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: body
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
}

export default new EmailService();