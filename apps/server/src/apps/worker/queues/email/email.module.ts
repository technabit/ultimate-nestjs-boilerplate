import { Module } from '@nestjs/common';
import { EmailQueueEvents } from './email.events';
import { EmailProcessor } from './email.processor';
import { EmailQueueService } from './email.service';

@Module({
  imports: [],
  providers: [EmailQueueService, EmailProcessor, EmailQueueEvents],
})
export class EmailQueueModule {}
