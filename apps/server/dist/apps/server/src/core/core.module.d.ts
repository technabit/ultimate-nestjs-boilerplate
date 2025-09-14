import { DynamicModule } from '@nestjs/common';
import { BULL_BOARD_PATH } from '@/core/config/bull/bull.config';
import { default as useThrottlerFactory } from '@/core/config/throttler/throttler.factory';
import { AppThrottlerGuard } from '@/core/config/throttler/throttler.guard';
import { default as useGraphqlFactory } from '@/core/graphql/graphql-fastify.factory';
import { default as useI18nFactory } from '@/core/i18n/i18n.factory';
export declare class CoreModule {
    static common(): DynamicModule;
}
export { AppThrottlerGuard, BULL_BOARD_PATH, useGraphqlFactory, useI18nFactory, useThrottlerFactory, };
