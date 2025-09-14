"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bull_config_1 = tslib_1.__importDefault(require("./bull.config"));
async function useBullFactory(configService) {
    const config = await (0, bull_config_1.default)();
    return {
        prefix: config.prefix,
        defaultJobOptions: config.defaultJobOptions,
        connection: {
            host: configService.getOrThrow('redis.host', {
                infer: true,
            }),
            port: configService.getOrThrow('redis.port', {
                infer: true,
            }),
            password: configService.getOrThrow('redis.password', {
                infer: true,
            }),
            tls: configService.get('redis.tls', { infer: true }),
        },
    };
}
exports.default = useBullFactory;
//# sourceMappingURL=bull.factory.js.map