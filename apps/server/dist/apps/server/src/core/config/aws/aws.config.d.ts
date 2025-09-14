import { AwsConfig } from './aws-config.types';
export declare function getConfig(): AwsConfig;
declare const _default: import("@nestjs/config").ConfigFactory<AwsConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AwsConfig | Promise<AwsConfig>>;
export default _default;
