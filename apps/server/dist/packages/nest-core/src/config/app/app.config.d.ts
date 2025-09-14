import { AppConfig } from './app-config.type';
export declare function getConfig(): AppConfig;
declare const _default: import("@nestjs/config").ConfigFactory<AppConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AppConfig | Promise<AppConfig>>;
export default _default;
