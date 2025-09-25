import { DynamicModule, Module } from '@nestjs/common';
import { CoreModule } from '@technabit/nest-core';

import bullBoardFeatures from './config/bull-board.config';
import { WorkerModule } from './worker/worker.module';
import { CommonModule } from './common/common.module';
import { ModulesModule } from './modules/modules.module';

const BULL_BOARD_FEATURES = bullBoardFeatures;

@Module({})
export class AppModule {
  static main(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ...CoreModule.api({
          i18n: {
            extraTranslationPaths: ['./src/i18n/translations'],
            typesOutputPath: './src/generated',
          },
          bullBoard: {
            // enable dashboard and only register if features are provided
            enabled: true,
            features: BULL_BOARD_FEATURES as any,
          },
        }).imports,
        CommonModule,
        ModulesModule,
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
