import { RedisConfig } from './redis-config.type';
export declare function getConfig(): RedisConfig;
declare const _default: import("@nestjs/config").ConfigFactory<RedisConfig> & import("@nestjs/config").ConfigFactoryKeyHost<RedisConfig | Promise<RedisConfig>>;
export default _default;
