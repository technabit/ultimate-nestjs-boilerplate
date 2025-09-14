import { BullConfig } from './bull-config.type';
export declare const BULL_BOARD_PATH = "/queues";
export declare function getConfig(): BullConfig;
declare const _default: import("@nestjs/config").ConfigFactory<BullConfig> & import("@nestjs/config").ConfigFactoryKeyHost<BullConfig | Promise<BullConfig>>;
export default _default;
