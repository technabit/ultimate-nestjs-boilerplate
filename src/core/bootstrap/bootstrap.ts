import fastifyCookie from '@fastify/cookie';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Reflector } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import path from 'path';

import { BULL_BOARD_PATH } from '@/core/config/bull/bull.config';
import { type GlobalConfig } from '@/core/config/config.type';
import {
  getCorsOptions,
  getHelmetOptions,
} from '@/core/config/security/security.config';
import { Environment } from '@/core/constants/app.constant';
import { SentryInterceptor } from '@/core/interceptors/sentry.interceptor';
import { basicAuthMiddleware } from '@/core/middlewares/basic-auth.middleware';
import { RedisIoAdapter } from '@/core/shared/socket/redis.adapter';
import setupSwagger, { SWAGGER_PATH } from '@/core/tools/swagger/swagger.setup';
import { consoleLoggingConfig } from '@/core/tools/logger/logger-factory';
import type { AppConfig } from '@/core/config/app/app-config.type';

export async function configureCommon(
  app: NestFastifyApplication,
  opts?: { isWorker?: boolean },
) {
  const isWorker = !!opts?.isWorker;
  const configService = app.get(ConfigService<GlobalConfig>);

  await app.register(fastifyCookie, {
    secret: configService.getOrThrow('auth.authSecret', {
      infer: true,
    }) as string,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException(errors),
    }),
  );

  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors(getCorsOptions(configService));
  app.use(helmet(getHelmetOptions(configService)));
  // Serialization
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const env = configService.getOrThrow('app.nodeEnv', {
    infer: true,
  }) as Environment;

  app.useStaticAssets({
    root: path.join(__dirname, '../../../src/tmp/file-uploads'),
    prefix: '/public',
    setHeaders(res: any) {
      res.setHeader(
        'Access-Control-Allow-Origin',
        configService.getOrThrow('app.corsOrigin', { infer: true }),
      );
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
  app.useGlobalInterceptors(new SentryInterceptor());

  if (env !== 'local') {
    setupGracefulShutdown({ app });
  }

  if (!isWorker) {
    app.useWebSocketAdapter(new RedisIoAdapter(app));
  }
}

export function configureApiHooks(app: NestFastifyApplication) {
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', async (req, reply) => {
      const pathsToIntercept = [
        `/api${BULL_BOARD_PATH}`,
        SWAGGER_PATH,
        `/api/auth/reference`,
      ];
      if (pathsToIntercept.some((p) => req.url.startsWith(p))) {
        await basicAuthMiddleware(req, reply);
      }
    });
}

export function configureSwaggerIfNeeded(app: NestFastifyApplication) {
  const configService = app.get(ConfigService<GlobalConfig>);
  const env = configService.getOrThrow('app.nodeEnv', {
    infer: true,
  }) as Environment;
  if (env !== 'production') {
    setupSwagger(app);
  }
}

export function getFastifyLoggerOption(appConfig: AppConfig): boolean | object {
  const envToLogger: Record<`${Environment}`, any> = {
    local: consoleLoggingConfig(),
    development: consoleLoggingConfig(),
    production: true,
    staging: true,
    test: false,
  } as const;
  return appConfig.appLogging ? envToLogger[appConfig.nodeEnv] : false;
}
