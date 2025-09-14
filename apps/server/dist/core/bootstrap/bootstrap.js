"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCommon = configureCommon;
exports.configureApiHooks = configureApiHooks;
exports.configureSwaggerIfNeeded = configureSwaggerIfNeeded;
exports.getFastifyLoggerOption = getFastifyLoggerOption;
const tslib_1 = require("tslib");
const cookie_1 = tslib_1.__importDefault(require("@fastify/cookie"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const nestjs_graceful_shutdown_1 = require("nestjs-graceful-shutdown");
const path_1 = tslib_1.__importDefault(require("path"));
const bull_config_1 = require("../config/bull/bull.config");
const security_config_1 = require("../config/security/security.config");
const sentry_interceptor_1 = require("../interceptors/sentry.interceptor");
const basic_auth_middleware_1 = require("../middlewares/basic-auth.middleware");
const redis_adapter_1 = require("../shared/socket/redis.adapter");
const logger_factory_1 = require("../tools/logger/logger-factory");
const swagger_setup_1 = tslib_1.__importStar(require("../tools/swagger/swagger.setup"));
async function configureCommon(app, opts) {
    const isWorker = !!opts?.isWorker;
    const configService = app.get((config_1.ConfigService));
    await app.register(cookie_1.default, {
        secret: configService.getOrThrow('auth.authSecret', {
            infer: true,
        }),
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory: (errors) => new common_1.UnprocessableEntityException(errors),
    }));
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.enableCors((0, security_config_1.getCorsOptions)(configService));
    app.use((0, helmet_1.default)((0, security_config_1.getHelmetOptions)(configService)));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector));
    const env = configService.getOrThrow('app.nodeEnv', {
        infer: true,
    });
    app.useStaticAssets({
        root: path_1.default.join(__dirname, '..', '..', 'tmp', 'file-uploads'),
        prefix: '/public',
        setHeaders(res) {
            res.setHeader('Access-Control-Allow-Origin', configService.getOrThrow('app.corsOrigin', { infer: true }));
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
    });
    Sentry.init({
        dsn: configService.getOrThrow('sentry.dsn', { infer: true }),
        tracesSampleRate: 1.0,
        environment: env,
    });
    app.useGlobalInterceptors(new sentry_interceptor_1.SentryInterceptor());
    if (env !== 'local') {
        (0, nestjs_graceful_shutdown_1.setupGracefulShutdown)({ app });
    }
    if (!isWorker) {
        app.useWebSocketAdapter(new redis_adapter_1.RedisIoAdapter(app));
    }
}
function configureApiHooks(app) {
    app
        .getHttpAdapter()
        .getInstance()
        .addHook('onRequest', async (req, reply) => {
        const pathsToIntercept = [
            `/api${bull_config_1.BULL_BOARD_PATH}`,
            swagger_setup_1.SWAGGER_PATH,
            `/api/auth/reference`,
        ];
        if (pathsToIntercept.some((p) => req.url.startsWith(p))) {
            await (0, basic_auth_middleware_1.basicAuthMiddleware)(req, reply);
        }
    });
}
function configureSwaggerIfNeeded(app) {
    const configService = app.get((config_1.ConfigService));
    const env = configService.getOrThrow('app.nodeEnv', {
        infer: true,
    });
    if (env !== 'production') {
        (0, swagger_setup_1.default)(app);
    }
}
function getFastifyLoggerOption(appConfig) {
    const envToLogger = {
        local: (0, logger_factory_1.consoleLoggingConfig)(),
        development: (0, logger_factory_1.consoleLoggingConfig)(),
        production: true,
        staging: true,
        test: false,
    };
    return appConfig.appLogging ? envToLogger[appConfig.nodeEnv] : false;
}
//# sourceMappingURL=bootstrap.js.map