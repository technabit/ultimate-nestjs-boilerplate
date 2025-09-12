import appConfig from '@/core/config/app/app.config';
import authConfig from '@/core/config/auth/auth.config';
import databaseConfig from '@/core/config/database/database.config';
import mailConfig from '@/core/config/mail/mail.config';
import redisConfig from '@/core/config/redis/redis.config';
import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { default as sentryConfig } from '@/core/config/sentry/sentry.config';
import { default as throttlerConfig } from '@/core/config/throttler/throttler.config';
import { default as useThrottlerFactory } from '@/core/config/throttler/throttler.factory';
import { AppThrottlerGuard } from '@/core/config/throttler/throttler.guard';
import { default as useGraphqlFactory } from '@/core/graphql/graphql-fastify.factory';
import { default as useI18nFactory } from '@/core/i18n/i18n.factory';
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

@Module({})
export class CoreModule {
  static common(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
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
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: databaseConfig,
        }),
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useBullFactory,
        }),
        PrometheusModule.register(),
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
          useFactory: useI18nFactory,
        }),
        // Rate limiter
        ThrottlerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useThrottlerFactory,
        }),
        // Auth bootstrapping
        AuthModule.forRootAsync(),
      ],
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
