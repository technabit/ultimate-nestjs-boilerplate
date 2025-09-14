"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppThrottlerGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const throttler_1 = require("@nestjs/throttler");
let AppThrottlerGuard = class AppThrottlerGuard extends throttler_1.ThrottlerGuard {
    getRequestResponse(context) {
        const type = context.getType();
        if (type === 'graphql') {
            const gqlCtx = graphql_1.GqlExecutionContext.create(context);
            const ctx = gqlCtx.getContext();
            return { req: ctx.req, res: ctx.res };
        }
        return super.getRequestResponse(context);
    }
    async getTracker(req) {
        const proxyIp = req?.headers['X-Forwarded'] ??
            req?.headers['x-forwarded'] ??
            req?.headers['X-Forwarded-For'] ??
            req?.headers['x-forwarded-for'] ??
            req?.headers?.['X-Real-IP'] ??
            req?.headers?.['x-real-ip'];
        return (proxyIp ?? req?.ips?.length) ? req?.ips[0] : req?.ip;
    }
};
exports.AppThrottlerGuard = AppThrottlerGuard;
exports.AppThrottlerGuard = AppThrottlerGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppThrottlerGuard);
//# sourceMappingURL=throttler.guard.js.map