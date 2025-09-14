import { type GlobalConfig } from '@/core/config/config.type';
import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { Options } from 'pino-http';
export declare function consoleLoggingConfig(): Options;
declare function useLoggerFactory(configService: ConfigService<GlobalConfig>): Promise<Params>;
export default useLoggerFactory;
