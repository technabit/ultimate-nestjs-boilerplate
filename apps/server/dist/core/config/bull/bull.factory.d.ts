import { GlobalConfig } from '@/core/config/config.type';
import { type BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
declare function useBullFactory(configService: ConfigService<GlobalConfig>): Promise<BullRootModuleOptions>;
export default useBullFactory;
