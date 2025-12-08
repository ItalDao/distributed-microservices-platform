import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CacheService } from '../cache/cache.service';

export interface SendNotificationDto {
  email: string;
  type: 'welcome' | 'payment-confirmation' | 'custom';
  data?: any;
}

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private cacheService: CacheService,
  ) {}

  async sendNotification(dto: SendNotificationDto) {
    // Check rate limiting (simple example)
    const rateLimitKey = `rate-limit:${dto.email}`;
    const exists = await this.cacheService.exists(rateLimitKey);

    if (exists) {
      return {
        success: false,
        message: 'Rate limit exceeded. Please try again later.',
      };
    }

    let result;

    switch (dto.type) {
      case 'welcome':
        result = await this.emailService.sendWelcomeEmail(
          dto.email,
          dto.data.firstName,
          dto.data.lastName,
        );
        break;
      case 'payment-confirmation':
        result = await this.emailService.sendPaymentConfirmation(
          dto.email,
          dto.data.amount,
          dto.data.currency,
          dto.data.transactionId,
        );
        break;
      default:
        return { success: false, message: 'Unknown notification type' };
    }

    // Set rate limit: 1 notification per minute per email
    if (result.success) {
      await this.cacheService.set(rateLimitKey, 'true', 60);
    }

    return result;
  }

  async getNotificationStats() {
    // In production, track stats in Redis or database
    return {
      totalSent: 0,
      successRate: 100,
      lastSent: new Date().toISOString(),
    };
  }
}