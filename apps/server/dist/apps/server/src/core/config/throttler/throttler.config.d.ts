import { ThrottlerConfig } from './throttler-config.type';
export declare function getConfig(): ThrottlerConfig;
declare const _default: import("@nestjs/config").ConfigFactory<ThrottlerConfig> & import("@nestjs/config").ConfigFactoryKeyHost<ThrottlerConfig | Promise<ThrottlerConfig>>;
export default _default;
