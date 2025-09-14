import appConfig from '@/core/config/app/app.config';
import authConfig from '@/core/config/auth/auth.config';
import databaseConfig from '@/core/config/database/database.config';
import mailConfig from '@/core/config/mail/mail.config';
import redisConfig from '@/core/config/redis/redis.config';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '@/core/auth/auth.module';
import { default as awsConfig } from '@/core/config/aws/aws.config';
import {
  BULL_BOARD_PATH, // kept export available to root app module
  default as bullConfig,
} from '@/core/config/bull/bull.config';
import { default as useBullFactory } from '@/core/config/bull/bull.factory';
import grafanaConfig from '@/core/config/grafana/grafana.config';
import prismaConfig from '@/core/config/prisma/prisma.config';
import { default as sentryConfig } from '@/core/config/sentry/sentry.config';
import { default as throttlerConfig } from '@/core/config/throttler/throttler.config';
import { default as useThrottlerFactory } from '@/core/config/throttler/throttler.factory';
import { AppThrottlerGuard } from '@/core/config/throttler/throttler.guard';
import { default as useGraphqlFactory } from '@/core/graphql/graphql-fastify.factory';
import { default as useI18nFactory } from '@/core/i18n/i18n.factory';
import { CoreQueuesModule } from '@/core/queues/queues.module';
import { CacheModule as CacheManagerModule } from '@/core/shared/cache/cache.module';
import { MailModule } from '@/core/shared/mail/mail.module';
import { default as useLoggerFactory } from '@/core/tools/logger/logger-factory';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

export type CoreI18nOptions = {
  i18n?: {
    // Additional translation roots relative to app cwd or absolute
    extraTranslationPaths?: string[];
    // Where to write generated i18n typings (file path). Default: src/generated/i18n.generated.ts
    typesOutputPath?: string;
  };
};

@Module({})
export class CoreModule {
  static common(options?: CoreI18nOptions): DynamicModule {
    const imports: any[] = [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [
          appConfig,
          databaseConfig,
          redisConfig,
          authConfig,
          mailConfig,
          bullConfig,
          sentryConfig,
          throttlerConfig,
          awsConfig,
          grafanaConfig,
          prismaConfig,
        ],
        envFilePath: ['.env'],
      }),
      GracefulShutdownModule.forRoot({
        cleanup: (...args) => {
          // eslint-disable-next-line no-console
          console.log('App shutting down...', args);
        },
      }),
      LoggerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: useLoggerFactory,
      }),
      // Introduce Prisma alongside TypeORM (Phase 1-2). TypeORM removal will follow.
      PrismaModule,
      BullModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: useBullFactory,
      }),
      PrometheusModule.register(),
      CoreQueuesModule,
      CacheManagerModule,
      MailModule,
      // i18n
      I18nModule.forRootAsync({
        resolvers: [
          { use: QueryResolver, options: ['lang'] },
          new HeaderResolver(['x-lang']),
          AcceptLanguageResolver,
        ],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          useI18nFactory(configService, options?.i18n),
      }),
      // Rate limiter
      ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: useThrottlerFactory,
      }),
      // Auth bootstrapping
      AuthModule.forRootAsync(),
    ];

    return {
      module: CoreModule,
      imports,
      providers: [
        {
          provide: APP_GUARD,
          useClass: AppThrottlerGuard,
        },
      ],
    };
  }
}

export {
  AppThrottlerGuard,
  BULL_BOARD_PATH,
  useGraphqlFactory,
  useI18nFactory,
  useThrottlerFactory,
};
