"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_manager_ioredis_yet_1 = require("cache-manager-ioredis-yet");
async function useCacheFactory(config) {
    return {
        store: await (0, cache_manager_ioredis_yet_1.redisStore)({
            host: config.getOrThrow('redis.host', {
                infer: true,
            }),
            port: config.getOrThrow('redis.port', {
                infer: true,
            }),
            password: config.getOrThrow('redis.password', {
                infer: true,
            }),
            tls: config.get('redis.tls', { infer: true }),
        }),
    };
}
exports.default = useCacheFactory;
//# sourceMappingURL=cache.factory.js.map