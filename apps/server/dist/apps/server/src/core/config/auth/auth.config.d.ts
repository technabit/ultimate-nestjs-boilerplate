import { AuthConfig } from './auth-config.type';
export declare function getConfig(): AuthConfig;
declare const _default: import("@nestjs/config").ConfigFactory<AuthConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AuthConfig | Promise<AuthConfig>>;
export default _default;
