export type PrismaConfig = {
    logging: {
        enabled: boolean;
        slowQueryThresholdMs: number;
        redactParams: boolean;
        maxQueryLength: number;
    };
};
declare const _default: import("@nestjs/config").ConfigFactory<PrismaConfig> & import("@nestjs/config").ConfigFactoryKeyHost<PrismaConfig | Promise<PrismaConfig>>;
export default _default;
