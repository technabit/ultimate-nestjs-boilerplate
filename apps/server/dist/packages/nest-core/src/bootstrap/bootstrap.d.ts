import { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { AppConfig } from '@/core/config/app/app-config.type';
export declare function configureCommon(app: NestFastifyApplication, opts?: {
    isWorker?: boolean;
}): Promise<void>;
export declare function configureApiHooks(app: NestFastifyApplication): void;
export declare function configureSwaggerIfNeeded(app: NestFastifyApplication): void;
export declare function getFastifyLoggerOption(appConfig: AppConfig): boolean | object;
