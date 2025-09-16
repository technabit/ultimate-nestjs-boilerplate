import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import {
  configureCommon,
  getAppConfig,
  getFastifyLoggerOption,
  type GlobalConfig,
} from '@technabit/nest-core';
import { AppModule } from './app.module';

const appConfig = getAppConfig();

async function bootstrap() {
  const isWorker = true;

  const app = (await NestFactory.create(
    AppModule.worker(),
    new (FastifyAdapter as any)({
      logger: getFastifyLoggerOption(appConfig),
      trustProxy: appConfig.isHttps,
    }) as any,
    { bufferLogs: true },
  )) as any;

  await configureCommon(app, { isWorker });

  const cfg = app.get(ConfigService<GlobalConfig>);

  await app.listen({
    port: cfg.getOrThrow('app.workerPort', { infer: true }),
    host: '0.0.0.0',
  });

  const httpUrl = await app.getUrl();

  // eslint-disable-next-line no-console
  console.info(`\x1b[33mWorker Server running at ${httpUrl}`);
}

void bootstrap();
