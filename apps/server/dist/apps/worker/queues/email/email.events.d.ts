import { QueueEventsHost } from '@nestjs/bullmq';
export declare class EmailQueueEvents extends QueueEventsHost {
    private readonly logger;
    onAdded(job: {
        jobId: string;
        name: string;
    }): void;
    onWaiting(job: {
        jobId: string;
        prev?: string;
    }): void;
}
