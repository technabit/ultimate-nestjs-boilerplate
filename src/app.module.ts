import { BullBoardModule } from '@bull-board/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import { ApiModule } from '@/application/api/api.module';
import { WorkerModule } from '@/application/worker/worker.module';
import { AuthModule } from '@/core/auth/auth.module';
import {
  AppThrottlerGuard,
  BULL_BOARD_PATH,
  CoreModule,
  useGraphqlFactory,
  useI18nFactory,
  useThrottlerFactory,
} from '@/core/core.module';
import { FastifyAdapter } from '@bull-board/fastify';

@Module({})
export class AppModule {
  static main(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ...CoreModule.common().imports,
        // I18n (translations)
        I18nModule.forRootAsync({
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            new HeaderResolver(['x-lang']),
            AcceptLanguageResolver,
          ],
          inject: [ConfigService],
          useFactory: useI18nFactory,
        }),
        // Application-specific modules for HTTP API
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          driver: ApolloDriver,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useGraphqlFactory,
        }),
        ThrottlerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useThrottlerFactory,
        }),
        BullBoardModule.forRoot({
          route: BULL_BOARD_PATH,
          adapter: FastifyAdapter,
        }),
        ApiModule,
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

  static worker(): DynamicModule {
    return {
      module: AppModule,
      imports: [...CoreModule.common().imports, WorkerModule],
    };
  }
}
