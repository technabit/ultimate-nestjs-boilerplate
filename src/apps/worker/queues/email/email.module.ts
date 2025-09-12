import { UserEntity } from '@/core/auth/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailQueueEvents } from './email.events';
import { EmailProcessor } from './email.processor';
import { EmailQueueService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [EmailQueueService, EmailProcessor, EmailQueueEvents],
})
export class EmailQueueModule {}
