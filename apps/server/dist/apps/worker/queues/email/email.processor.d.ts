import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailQueueService } from './email.service';
import { EmailJob } from './email.type';
declare const EmailJob: {
    readonly EmailVerification: "email-verification";
    readonly SignInMagicLink: "signin-magic-link";
    readonly ResetPassword: "reset-password";
};
export declare class EmailProcessor extends WorkerHost {
    private readonly emailQueueService;
    private readonly logger;
    constructor(emailQueueService: EmailQueueService);
    process(job: EmailJob, _token?: string): Promise<any>;
    onActive(job: Job): Promise<void>;
    onProgress(job: Job): Promise<void>;
    onCompleted(job: Job): Promise<void>;
    onFailed(job: Job): Promise<void>;
    onStalled(job: Job): Promise<void>;
    onError(job: Job, error: Error): Promise<void>;
}
export {};
