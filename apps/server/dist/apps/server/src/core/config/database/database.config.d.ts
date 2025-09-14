import { DatabaseConfig } from './database-config.type';
export declare enum DatabaseSSLMode {
    require = "require",
    disable = "disable"
}
export declare function getConfig(): DatabaseConfig;
declare const _default: import("@nestjs/config").ConfigFactory<DatabaseConfig> & import("@nestjs/config").ConfigFactoryKeyHost<DatabaseConfig | Promise<DatabaseConfig>>;
export default _default;
