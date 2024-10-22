import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    // Set the SendGrid API key from environment variables
    sgMail.setApiKey(
      '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',
    );
  }

  async sendInvitationEmail(email: string, username: string) {
    const msg = {
      to: email,
      from: 'chvamsi2106@gmail.com', // Use the sender email configured in SendGrid
      subject: `You are Invited! ${username}`,
      text: `Hello ${username}, you have been invited to join our platform!`,
      html: `<strong>Hello ${username},</strong><br>You have been invited to join our platform!`,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      // Optional: handle error more gracefully
    }
  }
}
