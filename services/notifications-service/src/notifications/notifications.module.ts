import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailModule } from '../email/email.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [EmailModule, CacheModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}