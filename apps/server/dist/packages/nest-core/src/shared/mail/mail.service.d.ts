import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmailVerificationMail({ email, url, }: {
        email: string;
        url: string;
    }): Promise<void>;
    sendAuthMagicLinkMail({ email, url }: {
        email: string;
        url: string;
    }): Promise<void>;
    sendResetPasswordMail({ email, url }: {
        email: string;
        url: string;
    }): Promise<void>;
}
