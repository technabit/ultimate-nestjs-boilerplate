"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const tslib_1 = require("tslib");
const mail_1 = require("../../../../../../packages/core/src/constants/mail");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let MailService = class MailService {
    mailerService;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendEmailVerificationMail({ email, url, }) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Verify your Email',
            template: mail_1.MailTemplate.EmailVerification,
            context: {
                email: email,
                url,
            },
        });
    }
    async sendAuthMagicLinkMail({ email, url }) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Magic Link',
            template: mail_1.MailTemplate.SignInMagicLink,
            context: {
                email: email,
                url,
            },
        });
    }
    async sendResetPasswordMail({ email, url }) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset Password',
            template: mail_1.MailTemplate.ResetPassword,
            context: {
                email: email,
                url,
            },
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map