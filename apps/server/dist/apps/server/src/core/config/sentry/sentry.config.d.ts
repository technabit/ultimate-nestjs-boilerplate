import { SentryConfig } from './sentry-config.type';
export declare function getConfig(): SentryConfig;
declare const _default: import("@nestjs/config").ConfigFactory<SentryConfig> & import("@nestjs/config").ConfigFactoryKeyHost<SentryConfig | Promise<SentryConfig>>;
export default _default;
