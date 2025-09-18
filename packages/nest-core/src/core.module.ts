import appConfig from '@/core/config/app/app.config';
import authConfig from '@/core/config/auth/auth.config';
import databaseConfig from '@/core/config/database/database.config';
import mailConfig from '@/core/config/mail/mail.config';
import redisConfig from '@/core/config/redis/redis.config';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '@/core/auth/auth.module';
import awsConfig from '@/core/config/aws/aws.config';
import {
  BULL_BOARD_PATH, // kept export available to root app module
  default as bullConfig,
} from '@/core/config/bull/bull.config';
import useBullFactory from '@/core/config/bull/bull.factory';
import grafanaConfig from '@/core/config/grafana/grafana.config';
import graphqlConfig from '@/core/config/graphql/graphql.config';
import prismaConfig from '@/core/config/prisma/prisma.config';
import sentryConfig from '@/core/config/sentry/sentry.config';
import throttlerConfig from '@/core/config/throttler/throttler.config';
import useThrottlerFactory from '@/core/config/throttler/throttler.factory';
import { AppThrottlerGuard } from '@/core/config/throttler/throttler.guard';
import useGraphqlFactory from '@/core/graphql/graphql-fastify.factory';
import useI18nFactory from '@/core/i18n/i18n.factory';
import { CoreApiOptions, CoreI18nOptions } from '@/core/types/core-api-options';
import { CoreQueuesModule } from '@/core/queues/queues.module';
import { CacheModule as CacheManagerModule } from '@/core/shared/cache/cache.module';
import { MailModule } from '@/core/shared/mail/mail.module';
import useLoggerFactory from '@/core/tools/logger/logger-factory';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

// types moved to '@/types/core-api-options'

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
          graphqlConfig,
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
        inject: [appConfig.KEY],
        useFactory: useLoggerFactory,
      }),
      PrismaModule,
      BullModule.forRootAsync({
        imports: [ConfigModule],
        inject: [bullConfig.KEY],
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
        inject: [appConfig.KEY],
        useFactory: (cfg) => useI18nFactory(cfg, options?.i18n),
      }),
      // Rate limiter
      ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [throttlerConfig.KEY, redisConfig.KEY],
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

  static api(options?: CoreApiOptions): DynamicModule {
    const imports: any[] = [
      ...CoreModule.common(options).imports,
      // GraphQL wiring (Apollo + Fastify-friendly context)
      GraphQLModule.forRootAsync<ApolloDriverConfig>({
        driver: ApolloDriver,
        imports: [ConfigModule],
        inject: [graphqlConfig.KEY, appConfig.KEY],
        useFactory: useGraphqlFactory,
      }),
    ];

    const bullBoard = options?.bullBoard;
    const bullBoardEnabled = bullBoard?.enabled !== false;
    if (bullBoardEnabled && bullBoard?.features && bullBoard.features.length > 0) {
      try {
        // Lazy load so nest-core doesn't hard depend on bull-board packages
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { BullBoardModule } = require('@bull-board/nestjs');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { FastifyAdapter } = require('@bull-board/fastify');

        const route = bullBoard?.route ?? BULL_BOARD_PATH;
        imports.push(
          BullBoardModule.forRoot({
            route,
            adapter: FastifyAdapter,
          }),
          BullBoardModule.forFeature(...(bullBoard.features as any)),
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          '[nest-core] Bull Board packages not installed in consumer app, skipping BullBoardModule wiring.',
        );
      }
    }

    return {
      module: CoreModule,
      imports,
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
