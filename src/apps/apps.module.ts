import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { ApiModule } from '@/apps/api/api.module';
import { WorkerModule } from '@/apps/worker/worker.module';
import { Queue } from '@/core/constants/job.constant';

@Module({
  imports: [
    ApiModule,
    // Register queues for Bull Board UI (API only)
    BullBoardModule.forFeature({ name: Queue.Email, adapter: BullMQAdapter }),
  ],
})
export class AppsApiModule {}

@Module({
  imports: [WorkerModule],
})
export class AppsWorkerModule {}

