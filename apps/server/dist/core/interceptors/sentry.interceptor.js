"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
require("dotenv/config");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const sentry_config_1 = require("../config/sentry/sentry.config");
const enableSentry = (err, context) => {
    if (err instanceof common_1.HttpException) {
        return (0, rxjs_1.throwError)(() => err);
    }
    Sentry.withScope((scope) => {
        scope.addEventProcessor(async (event) => Sentry.addRequestDataToEvent(event, context.getArgs()[0]));
        Sentry.captureException(err);
    });
    return (0, rxjs_1.throwError)(() => err);
};
let SentryInterceptor = class SentryInterceptor {
    intercept(context, next) {
        const sentryConfig = (0, sentry_config_1.getConfig)();
        if (sentryConfig.logging) {
            return next
                .handle()
                .pipe((0, operators_1.catchError)((err) => enableSentry(err, context)));
        }
        return next.handle().pipe((0, operators_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
    }
};
exports.SentryInterceptor = SentryInterceptor;
exports.SentryInterceptor = SentryInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], SentryInterceptor);
//# sourceMappingURL=sentry.interceptor.js.map