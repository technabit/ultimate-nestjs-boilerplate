import { MailConfig } from './mail-config.type';
export declare function getConfig(): MailConfig;
declare const _default: import("@nestjs/config").ConfigFactory<MailConfig> & import("@nestjs/config").ConfigFactoryKeyHost<MailConfig | Promise<MailConfig>>;
export default _default;
