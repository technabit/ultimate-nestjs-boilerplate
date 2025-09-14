"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const bootstrap_1 = require("./core/bootstrap/bootstrap");
const app_config_1 = require("./core/config/app/app.config");
const appConfig = (0, app_config_1.getConfig)();
async function bootstrap() {
    const isWorker = false;
    const app = await core_1.NestFactory.create(app_module_1.AppModule.main(), new platform_fastify_1.FastifyAdapter({
        logger: (0, bootstrap_1.getFastifyLoggerOption)(appConfig),
        trustProxy: appConfig.isHttps,
    }), { bufferLogs: true });
    await (0, bootstrap_1.configureCommon)(app, { isWorker });
    (0, bootstrap_1.configureSwaggerIfNeeded)(app);
    (0, bootstrap_1.configureApiHooks)(app);
    const cfg = app.get((config_1.ConfigService));
    await app.listen({
        port: cfg.getOrThrow('app.port', { infer: true }),
        host: '0.0.0.0',
    });
    const httpUrl = await app.getUrl();
    console.info(`\x1b[34mServer running at ${httpUrl}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map