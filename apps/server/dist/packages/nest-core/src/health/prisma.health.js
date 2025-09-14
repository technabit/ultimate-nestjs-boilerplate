"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHealthIndicator = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("../database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
let PrismaHealthIndicator = class PrismaHealthIndicator extends terminus_1.HealthIndicator {
    prisma;
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async pingCheck(key = 'database', timeout = 5000) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeout);
            await this.prisma.$queryRawUnsafe('SELECT 1');
            clearTimeout(timer);
            return this.getStatus(key, true);
        }
        catch (e) {
            throw new terminus_1.HealthCheckError('PrismaHealthIndicator failed', e);
        }
    }
};
exports.PrismaHealthIndicator = PrismaHealthIndicator;
exports.PrismaHealthIndicator = PrismaHealthIndicator = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaHealthIndicator);
//# sourceMappingURL=prisma.health.js.map