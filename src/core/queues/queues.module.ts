import { Queue } from '@/core/constants/job.constant';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    // Register all queues here with their options
    BullModule.registerQueue({
      name: Queue.Email,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    }),
  ],
  exports: [BullModule],
})
export class CoreQueuesModule {}
