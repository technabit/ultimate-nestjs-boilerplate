import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from '@/app.module';
import {
  configureApiHooks,
  configureCommon,
  configureSwaggerIfNeeded,
  getFastifyLoggerOption,
} from '@/core/bootstrap/bootstrap';
import { getConfig as getAppConfig } from '@/core/config/app/app.config';
import { type GlobalConfig } from '@/core/config/config.type';

const appConfig = getAppConfig();

async function bootstrap() {
  const isWorker = false;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.main(),
    new FastifyAdapter({
      logger: getFastifyLoggerOption(appConfig),
      trustProxy: appConfig.isHttps,
    }),
    { bufferLogs: true },
  );

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
