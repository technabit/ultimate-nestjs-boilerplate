import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { AppModule } from '@/app.module';
import {
  configureApiHooks,
  configureCommon,
  configureSwaggerIfNeeded,
  getAppConfig,
  getFastifyLoggerOption,
  type GlobalConfig,
} from '@technabit/nest-core';

const appConfig = getAppConfig();

async function bootstrap() {
  const isWorker = false;

  const app = (await NestFactory.create(
    AppModule.main(),
    new (FastifyAdapter as any)({
      logger: getFastifyLoggerOption(appConfig),
      trustProxy: appConfig.isHttps,
    }) as any,
    { bufferLogs: true },
  )) as any;

  await configureCommon(app, { isWorker });

  configureSwaggerIfNeeded(app);
  configureApiHooks(app);

  const cfg = app.get(ConfigService<GlobalConfig>);

  await app.listen({
    port: cfg.getOrThrow('app.port', { infer: true }),
    host: '0.0.0.0',
  });

  const httpUrl = await app.getUrl();

  // eslint-disable-next-line no-console
  console.info(`\x1b[34mServer running at ${httpUrl}`);
}

void bootstrap();
