import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { FastifyAdapter } from '@bull-board/fastify';
import {
  BULL_BOARD_PATH,
  CoreModule,
  graphqlConfig,
  appConfig,
  useGraphqlFactory,
} from '@technabit/nest-core';

import { ApiModule } from '@/apps/api/api.module';
import { WorkerModule } from '@/apps/worker/worker.module';
import { Queue } from '@technabit/nest-core';

const BULL_BOARD_FEATURES = (Object.values(Queue) as string[]).map((name) => ({
  name,
  adapter: BullMQAdapter,
}));

@Module({})
export class AppModule {
  static main(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ...CoreModule.common({
          i18n: {
            extraTranslationPaths: ['./src/i18n/translations'],
            typesOutputPath: './src/generated',
          },
        }).imports,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          driver: ApolloDriver,
          imports: [ConfigModule],
          inject: [graphqlConfig.KEY, appConfig.KEY],
          useFactory: useGraphqlFactory,
        }),
        BullBoardModule.forRoot({
          route: BULL_BOARD_PATH,
          adapter: FastifyAdapter,
        }),
        BullBoardModule.forFeature(
          ...(BULL_BOARD_FEATURES as unknown as Parameters<
            typeof BullBoardModule.forFeature
          >[0][]),
        ),
        ApiModule,
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
