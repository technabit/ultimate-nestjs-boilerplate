import { SocketModule } from '@/core/shared/socket/socket.module';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Queue } from '@/core/constants/job.constant';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    SocketModule,
    BullModule.registerQueue({ name: Queue.Email }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
