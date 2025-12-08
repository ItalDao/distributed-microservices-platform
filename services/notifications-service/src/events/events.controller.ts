import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../email/email.service';

@Controller()
export class EventsController {
  constructor(private emailService: EmailService) {}

  @EventPattern('user.registered')
  async handleUserRegistered(@Payload() data: any) {
    console.log('📨 Received user.registered event:', data);

    await this.emailService.sendWelcomeEmail(
      data.email,
      data.firstName,
      data.lastName,
    );
  }

  @EventPattern('payment.created')
  async handlePaymentCreated(@Payload() data: any) {
    console.log('📨 Received payment.created event:', data);

    // In a real app, fetch user email from Auth Service
    // For demo, we'll just log it
    console.log(
      `💳 Payment created: $${data.amount} ${data.currency} by user ${data.userId}`,
    );
  }

  @EventPattern('payment.processed')
  async handlePaymentProcessed(@Payload() data: any) {
    console.log('📨 Received payment.processed event:', data);

    if (data.success) {
      console.log(`✅ Payment ${data.paymentId} was successful!`);
      // In production: await this.emailService.sendPaymentConfirmation(...)
    } else {
      console.log(`❌ Payment ${data.paymentId} failed!`);
      // In production: send payment failure notification
    }
  }
}