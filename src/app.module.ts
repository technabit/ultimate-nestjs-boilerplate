import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import {
  BULL_BOARD_PATH,
  CoreModule,
  useGraphqlFactory,
} from '@/core/core.module';
import { FastifyAdapter } from '@bull-board/fastify';

import { Queue } from '@/core/constants/job.constant';
import { ApiModule } from './apps/api/api.module';
import { WorkerModule } from './apps/worker/worker.module';

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
        ...CoreModule.common().imports,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          driver: ApolloDriver,
          imports: [ConfigModule],
          inject: [ConfigService],
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
