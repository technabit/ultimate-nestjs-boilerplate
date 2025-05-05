import { Job as JobName } from '@/constants/job.constant';
import { Job, Queue } from 'bullmq';

export interface EmailVerificationJob {
  name: typeof JobName.EmailVerification;
  data: {
    userId: string;
    url: string;
  };
}

export interface SignInMagicLinkJob {
  name: typeof JobName.SignInMagicLink;
  data: {
    email: string;
    url: string;
  };
}

type JobDataMap = {
  [JobName.EmailVerification]: EmailVerificationJob['data'];
  [JobName.SignInMagicLink]: SignInMagicLinkJob['data'];
};

type QueueJob<N extends keyof JobDataMap> = {
  name: N;
  data: JobDataMap[N];
};

export type EmailQueue = Queue<QueueJob<keyof JobDataMap>> & {
  add<N extends keyof JobDataMap>(name: N, data: JobDataMap[N]): Promise<void>;
};

export type EmailJob =
  | Job<EmailVerificationJob['data'], any, typeof JobName.EmailVerification>
  | Job<SignInMagicLinkJob['data'], any, typeof JobName.SignInMagicLink>;
