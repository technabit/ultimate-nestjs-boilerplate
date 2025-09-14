import { type GlobalConfig } from '@/core/config/config.type';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import type { HelmetOptions } from 'helmet';
export declare function getCorsOptions(configService: ConfigService<GlobalConfig>): CorsOptions;
export declare function getHelmetOptions(configService: ConfigService<GlobalConfig>): HelmetOptions;
