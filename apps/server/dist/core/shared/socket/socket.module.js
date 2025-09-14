"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_module_1 = require("../cache/cache.module");
const socket_gateway_1 = require("./socket.gateway");
const socket_service_1 = require("./socket.service");
let SocketModule = class SocketModule {
};
exports.SocketModule = SocketModule;
exports.SocketModule = SocketModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [cache_module_1.CacheModule],
        providers: [socket_gateway_1.SocketGateway, config_1.ConfigService, socket_service_1.SocketService],
        exports: [socket_service_1.SocketService],
    })
], SocketModule);
//# sourceMappingURL=socket.module.js.map