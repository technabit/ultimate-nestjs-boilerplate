"use strict";
var CoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThrottlerFactory = exports.useI18nFactory = exports.useGraphqlFactory = exports.BULL_BOARD_PATH = exports.AppThrottlerGuard = exports.CoreModule = void 0;
const tslib_1 = require("tslib");
const app_config_1 = tslib_1.__importDefault(require("./config/app/app.config"));
const auth_config_1 = tslib_1.__importDefault(require("./config/auth/auth.config"));
const database_config_1 = tslib_1.__importDefault(require("./config/database/database.config"));
const mail_config_1 = tslib_1.__importDefault(require("./config/mail/mail.config"));
const redis_config_1 = tslib_1.__importDefault(require("./config/redis/redis.config"));
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./database/prisma/prisma.module");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const nestjs_graceful_shutdown_1 = require("nestjs-graceful-shutdown");
const nestjs_pino_1 = require("nestjs-pino");
const auth_module_1 = require("./auth/auth.module");
const aws_config_1 = tslib_1.__importDefault(require("./config/aws/aws.config"));
const bull_config_1 = tslib_1.__importStar(require("./config/bull/bull.config"));
Object.defineProperty(exports, "BULL_BOARD_PATH", { enumerable: true, get: function () { return bull_config_1.BULL_BOARD_PATH; } });
const bull_factory_1 = tslib_1.__importDefault(require("./config/bull/bull.factory"));
const grafana_config_1 = tslib_1.__importDefault(require("./config/grafana/grafana.config"));
const prisma_config_1 = tslib_1.__importDefault(require("./config/prisma/prisma.config"));
const sentry_config_1 = tslib_1.__importDefault(require("./config/sentry/sentry.config"));
const throttler_config_1 = tslib_1.__importDefault(require("./config/throttler/throttler.config"));
const throttler_factory_1 = tslib_1.__importDefault(require("./config/throttler/throttler.factory"));
Object.defineProperty(exports, "useThrottlerFactory", { enumerable: true, get: function () { return throttler_factory_1.default; } });
const throttler_guard_1 = require("./config/throttler/throttler.guard");
Object.defineProperty(exports, "AppThrottlerGuard", { enumerable: true, get: function () { return throttler_guard_1.AppThrottlerGuard; } });
const graphql_fastify_factory_1 = tslib_1.__importDefault(require("./graphql/graphql-fastify.factory"));
Object.defineProperty(exports, "useGraphqlFactory", { enumerable: true, get: function () { return graphql_fastify_factory_1.default; } });
const i18n_factory_1 = tslib_1.__importDefault(require("./i18n/i18n.factory"));
Object.defineProperty(exports, "useI18nFactory", { enumerable: true, get: function () { return i18n_factory_1.default; } });
const queues_module_1 = require("./queues/queues.module");
const cache_module_1 = require("./shared/cache/cache.module");
const mail_module_1 = require("./shared/mail/mail.module");
const logger_factory_1 = tslib_1.__importDefault(require("./tools/logger/logger-factory"));
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const nestjs_i18n_1 = require("nestjs-i18n");
let CoreModule = CoreModule_1 = class CoreModule {
    static common() {
        return {
            module: CoreModule_1,
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    load: [
                        app_config_1.default,
                        database_config_1.default,
                        redis_config_1.default,
                        auth_config_1.default,
                        mail_config_1.default,
                        bull_config_1.default,
                        sentry_config_1.default,
                        throttler_config_1.default,
                        aws_config_1.default,
                        grafana_config_1.default,
                        prisma_config_1.default,
                    ],
                    envFilePath: ['.env'],
                }),
                nestjs_graceful_shutdown_1.GracefulShutdownModule.forRoot({
                    cleanup: (...args) => {
                        console.log('App shutting down...', args);
                    },
                }),
                nestjs_pino_1.LoggerModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: logger_factory_1.default,
                }),
                prisma_module_1.PrismaModule,
                bullmq_1.BullModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: bull_factory_1.default,
                }),
                nestjs_prometheus_1.PrometheusModule.register(),
                queues_module_1.CoreQueuesModule,
                cache_module_1.CacheModule,
                mail_module_1.MailModule,
                nestjs_i18n_1.I18nModule.forRootAsync({
                    resolvers: [
                        { use: nestjs_i18n_1.QueryResolver, options: ['lang'] },
                        new nestjs_i18n_1.HeaderResolver(['x-lang']),
                        nestjs_i18n_1.AcceptLanguageResolver,
                    ],
                    inject: [config_1.ConfigService],
                    useFactory: i18n_factory_1.default,
                }),
                throttler_1.ThrottlerModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: throttler_factory_1.default,
                }),
                auth_module_1.AuthModule.forRootAsync(),
            ],
            providers: [
                {
                    provide: core_1.APP_GUARD,
                    useClass: throttler_guard_1.AppThrottlerGuard,
                },
            ],
        };
    }
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = CoreModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], CoreModule);
//# sourceMappingURL=core.module.js.map