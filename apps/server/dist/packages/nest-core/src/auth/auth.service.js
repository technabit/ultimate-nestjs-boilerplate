"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const job_1 = require("../../../core/src/constants/job");
const prisma_service_1 = require("../database/prisma/prisma.service");
const cache_service_1 = require("../shared/cache/cache.service");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    configService;
    emailQueue;
    cacheService;
    prisma;
    constructor(configService, emailQueue, cacheService, prisma) {
        this.configService = configService;
        this.emailQueue = emailQueue;
        this.cacheService = cacheService;
        this.prisma = prisma;
    }
    async sendSigninMagicLink({ email, url }) {
        const user = await this.prisma.user.findFirst({
            where: { email, deletedAt: null },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        const cacheKey = {
            key: 'SignInMagicLinkMailLastSentAt',
            args: [user.id],
        };
        const remainingTtl = await this.cacheService.getTtl(cacheKey);
        if (!(remainingTtl == null) && remainingTtl !== 0) {
            throw new common_1.HttpException(`Too many requests. Please wait ${Math.floor(remainingTtl / 1000)} seconds before sending again.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        await this.emailQueue.add('signin-magic-link', {
            email,
            url,
        });
        await this.cacheService.set(cacheKey, +new Date(), { ttl: 30_000 });
    }
    async verifyEmail({ url, userId }) {
        const cacheKey = {
            key: 'EmailVerificationMailLastSentAt',
            args: [userId],
        };
        const remainingTtl = await this.cacheService.getTtl(cacheKey);
        if (!(remainingTtl == null) && remainingTtl !== 0) {
            throw new common_1.HttpException(`Too many requests. Please wait ${Math.floor(remainingTtl / 1000)} seconds before sending again.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        await this.emailQueue.add('email-verification', {
            url,
            userId,
        });
        await this.cacheService.set(cacheKey, +new Date(), { ttl: 30_000 });
    }
    async resetPassword({ url, userId }) {
        const cacheKey = {
            key: 'ResetPasswordMailLastSentAt',
            args: [userId],
        };
        const remainingTtl = await this.cacheService.getTtl(cacheKey);
        if (!(remainingTtl == null) && remainingTtl !== 0) {
            throw new common_1.HttpException(`Too many requests. Please wait ${Math.floor(remainingTtl / 1000)} seconds before sending again.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        await this.emailQueue.add('reset-password', {
            url,
            userId,
        });
        await this.cacheService.set(cacheKey, +new Date(), { ttl: 30_000 });
    }
    createBasicAuthHeaders() {
        const username = this.configService.getOrThrow('auth.basicAuth.username', {
            infer: true,
        });
        const password = this.configService.getOrThrow('auth.basicAuth.password', {
            infer: true,
        });
        const base64Credential = Buffer.from(`${username}:${password}`).toString('base64');
        return {
            Authorization: `Basic ${base64Credential}`,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(1, (0, bullmq_1.InjectQueue)(job_1.Queue.Email)),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService, Object, cache_service_1.CacheService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map