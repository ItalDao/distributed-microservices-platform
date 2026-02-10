import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private emailEnabled: boolean;

  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {
    const emailUser = this.configService.get<string>('email.user');
    const emailPass = this.configService.get<string>('email.pass');
    const placeholderUser = 'your_email@gmail.com';
    const placeholderPass = 'your_app_password';

    this.emailEnabled = !!emailUser && !!emailPass &&
      emailUser !== placeholderUser &&
      emailPass !== placeholderPass;

    if (this.emailEnabled) {
      this.transporter = nodemailer.createTransport({
        service: this.configService.get<string>('email.service'),
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  async sendWelcomeEmail(email: string, firstName: string, lastName: string) {
    if (!this.emailEnabled) {
      console.log(`Email not configured. Skipping welcome email for ${email}`);
      return { success: true, message: 'Email skipped (not configured)' };
    }
    const template = await this.getTemplate('welcome');

    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to: email,
      subject: 'Welcome to our platform!',
      html: template
        .replace('{{firstName}}', firstName)
        .replace('{{lastName}}', lastName)
        .replace('{{email}}', email),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return { success: true, message: 'Welcome email sent' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }

  async sendPaymentConfirmation(
    email: string,
    amount: number,
    currency: string,
    transactionId: string,
  ) {
    if (!this.emailEnabled) {
      console.log(
        `Email not configured. Skipping payment confirmation for ${email}`,
      );
      return { success: true, message: 'Email skipped (not configured)' };
    }
    const template = await this.getTemplate('payment-confirmation');

    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to: email,
      subject: 'Payment Confirmation',
      html: template
        .replace('{{amount}}', amount.toString())
        .replace('{{currency}}', currency)
        .replace('{{transactionId}}', transactionId)
        .replace('{{email}}', email),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment confirmation sent to ${email}`);
      return { success: true, message: 'Payment confirmation sent' };
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }

  private async getTemplate(templateName: string): Promise<string> {
    // Try to get from cache first
    const cached = await this.cacheService.get(`template:${templateName}`);
    if (cached) {
      return cached;
    }

    // Default templates (in production, load from files or database)
    const templates = {
      welcome: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Welcome {{firstName}} {{lastName}}!</h1>
            <p>Thank you for registering at our platform.</p>
            <p>Your account email: <strong>{{email}}</strong></p>
            <p>We're excited to have you on board!</p>
            <br>
            <p>Best regards,<br>The Microservices Team</p>
          </body>
        </html>
      `,
      'payment-confirmation': `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Payment Confirmation</h1>
            <p>Your payment has been processed successfully!</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Amount:</strong> {{amount}} {{currency}}</p>
              <p><strong>Transaction ID:</strong> {{transactionId}}</p>
              <p><strong>Email:</strong> {{email}}</p>
            </div>
            <p>Thank you for your purchase!</p>
            <br>
            <p>Best regards,<br>The Microservices Team</p>
          </body>
        </html>
      `,
    };

    const template = templates[templateName] || '<p>Template not found</p>';

    // Cache template for 1 hour
    await this.cacheService.set(`template:${templateName}`, template, 3600);

    return template;
  }
}