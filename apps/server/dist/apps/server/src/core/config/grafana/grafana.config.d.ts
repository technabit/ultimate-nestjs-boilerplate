import { GrafanaConfig } from './grafana.type';
export declare function getConfig(): GrafanaConfig;
declare const _default: import("@nestjs/config").ConfigFactory<GrafanaConfig> & import("@nestjs/config").ConfigFactoryKeyHost<GrafanaConfig | Promise<GrafanaConfig>>;
export default _default;
