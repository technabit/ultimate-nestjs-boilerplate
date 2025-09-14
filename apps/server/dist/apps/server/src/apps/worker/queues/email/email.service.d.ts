import { MailService } from '@app/nest-core';
import { PrismaService } from '@app/nest-core';
import { EmailVerificationJob, ResetPasswordJob, SignInMagicLinkJob } from './email.type';
export declare class EmailQueueService {
    private readonly mailService;
    private readonly prisma;
    private logger;
    constructor(mailService: MailService, prisma: PrismaService);
    verifyEmail(data: EmailVerificationJob['data']): Promise<void>;
    sendMagicLink(data: SignInMagicLinkJob['data']): Promise<void>;
    resetPassword(data: ResetPasswordJob['data']): Promise<void>;
}
