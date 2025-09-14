"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const redis_config_1 = require("../../config/redis/redis.config");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
require("dotenv/config");
const ioredis_1 = require("ioredis");
const redisConfig = (0, redis_config_1.getConfig)();
const pubClient = new ioredis_1.Redis(redisConfig);
const subClient = pubClient.duplicate();
const redisAdapter = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis.adapter.js.map