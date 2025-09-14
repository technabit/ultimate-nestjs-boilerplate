"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const tslib_1 = require("tslib");
const mail_service_1 = require("../../../../core/shared/mail/mail.service");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../core/database/prisma/prisma.service");
let EmailQueueService = class EmailQueueService {
    mailService;
    prisma;
    logger = new common_1.Logger(this.constructor.name);
    constructor(mailService, prisma) {
        this.mailService = mailService;
        this.prisma = prisma;
    }
    async verifyEmail(data) {
        const user = await this.prisma.user.findFirst({ where: { id: data.userId, deletedAt: null } });
        if (!user) {
            this.logger.error(`User id = ${data.userId} does not exist.`);
        }
        await this.mailService.sendEmailVerificationMail({
            email: user.email,
            url: data.url,
        });
    }
    async sendMagicLink(data) {
        const user = await this.prisma.user.findFirst({ where: { email: data.email, deletedAt: null } });
        if (!user) {
            return;
        }
        await this.mailService.sendAuthMagicLinkMail({
            email: user.email,
            url: data.url,
        });
    }
    async resetPassword(data) {
        const user = await this.prisma.user.findFirst({ where: { id: data.userId, deletedAt: null } });
        if (!user) {
            return;
        }
        await this.mailService.sendResetPasswordMail({
            email: user.email,
            url: data.url,
        });
    }
};
exports.EmailQueueService = EmailQueueService;
exports.EmailQueueService = EmailQueueService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [mail_service_1.MailService,
        prisma_service_1.PrismaService])
], EmailQueueService);
//# sourceMappingURL=email.service.js.map