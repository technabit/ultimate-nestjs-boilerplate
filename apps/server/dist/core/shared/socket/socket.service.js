"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const socket_gateway_1 = require("./socket.gateway");
let SocketService = class SocketService {
    socketGateway;
    cacheService;
    constructor(socketGateway, cacheService) {
        this.socketGateway = socketGateway;
        this.cacheService = cacheService;
    }
    async sendTo(userId, event, data) {
        const userClients = await this.cacheService.get({
            key: 'UserSocketClients',
            args: [userId],
        });
        if (userClients && Array.isArray(userClients)) {
            for (const clientId of userClients) {
                const client = this.socketGateway.getClient(clientId);
                if (client) {
                    client.send(JSON.stringify({
                        event,
                        data,
                    }));
                }
            }
        }
    }
    async sendToAll(event, data) {
        const allClients = this.socketGateway.getAllClients();
        for (const client of allClients.values()) {
            client.send(JSON.stringify({
                event,
                data,
            }));
        }
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [socket_gateway_1.SocketGateway,
        cache_service_1.CacheService])
], SocketService);
//# sourceMappingURL=socket.service.js.map