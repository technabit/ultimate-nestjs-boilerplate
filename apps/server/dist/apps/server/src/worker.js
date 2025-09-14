"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const nest_core_1 = require("@app/nest-core");
const appConfig = (0, nest_core_1.getAppConfig)();
async function bootstrap() {
    const isWorker = true;
    const app = (await core_1.NestFactory.create(app_module_1.AppModule.worker(), new platform_fastify_1.FastifyAdapter({
        logger: (0, nest_core_1.getFastifyLoggerOption)(appConfig),
        trustProxy: appConfig.isHttps,
    }), { bufferLogs: true }));
    await (0, nest_core_1.configureCommon)(app, { isWorker });
    const cfg = app.get((config_1.ConfigService));
    await app.listen({
        port: cfg.getOrThrow('app.workerPort', { infer: true }),
        host: '0.0.0.0',
    });
    const httpUrl = await app.getUrl();
    console.info(`\x1b[33mWorker Server running at ${httpUrl}`);
}
void bootstrap();
//# sourceMappingURL=worker.js.map