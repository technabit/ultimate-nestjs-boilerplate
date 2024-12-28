import { UserEntity } from '@/api/user/entities/user.entity';
import { Queue } from '@/constants/job.constant';
import { JwtModule } from '@/shared/jwt/jwt.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailQueueEvents } from './email.events';
import { EmailProcessor } from './email.processor';
import { EmailQueueService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: Queue.Email,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    }),
    JwtModule,
  ],
  providers: [EmailQueueService, EmailProcessor, EmailQueueEvents],
})
export class EmailQueueModule {}
