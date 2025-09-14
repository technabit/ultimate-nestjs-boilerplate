"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const tslib_1 = require("tslib");
const auth_guard_1 = require("../../auth/auth.guard");
const better_auth_service_1 = require("../../auth/better-auth.service");
const app_config_1 = require("../../config/app/app.config");
const current_user_session_decorator_1 = require("../../decorators/auth/current-user-session.decorator");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const node_1 = require("better-auth/node");
require("dotenv/config");
const ms_1 = tslib_1.__importDefault(require("ms"));
const socket_io_1 = require("socket.io");
const cache_service_1 = require("../cache/cache.service");
const appConfig = (0, app_config_1.getConfig)();
let SocketGateway = class SocketGateway {
    cacheService;
    betterAuthService;
    logger = new common_1.Logger(this.constructor.name);
    server;
    clients;
    constructor(cacheService, betterAuthService) {
        this.cacheService = cacheService;
        this.betterAuthService = betterAuthService;
        this.clients = new Map();
    }
    afterInit() {
        this.logger.log(`Websocket gateway initialized.`);
        this.server.use(async (socket, next) => {
            try {
                const session = await this.betterAuthService.api.getSession({
                    headers: (0, node_1.fromNodeHeaders)(socket?.handshake?.headers),
                });
                if (!session) {
                    throw new Error();
                }
                socket['session'] = session;
                return next();
            }
            catch {
                return next(new common_1.UnauthorizedException({
                    code: 'UNAUTHORIZED',
                }));
            }
        });
    }
    async handleConnection(socket) {
        const userId = socket?.session?.user?.id;
        if (!userId) {
            return;
        }
        this.clients.set(socket?.id, socket);
        const userClients = await this.cacheService.get({
            key: 'UserSocketClients',
            args: [userId],
        });
        const clients = new Set(Array.from(userClients ?? []));
        clients.add(socket?.id);
        await this.cacheService.set({ key: 'UserSocketClients', args: [userId] }, Array.from(clients), { ttl: (0, ms_1.default)('1h') });
    }
    async handleDisconnect(socket) {
        this.clients.delete(socket?.id);
        const userId = socket?.session?.user?.id;
        if (!userId) {
            return;
        }
        const userClients = await this.cacheService.get({
            key: 'UserSocketClients',
            args: [userId],
        });
        const clients = new Set(Array.from(userClients ?? []));
        if (clients.has(socket?.id)) {
            clients.delete(socket?.id);
            await this.cacheService.set({ key: 'UserSocketClients', args: [userId] }, Array.from(clients), { ttl: (0, ms_1.default)('1h') });
        }
    }
    handleMessage(socket, _message, _user) {
        socket.send('hello world');
    }
    async handlePing(socket) {
        socket.send('pong');
    }
    getClient(clientId) {
        return this.clients?.get(clientId);
    }
    getAllClients() {
        return this.clients;
    }
};
exports.SocketGateway = SocketGateway;
tslib_1.__decorate([
    (0, websockets_1.WebSocketServer)(),
    tslib_1.__metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
tslib_1.__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, websockets_1.SubscribeMessage)('message'),
    tslib_1.__param(0, (0, websockets_1.ConnectedSocket)()),
    tslib_1.__param(1, (0, websockets_1.MessageBody)()),
    tslib_1.__param(2, (0, current_user_session_decorator_1.CurrentUserSession)('user')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleMessage", null);
tslib_1.__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SocketGateway.prototype, "handlePing", null);
exports.SocketGateway = SocketGateway = tslib_1.__decorate([
    (0, websockets_1.WebSocketGateway)(0, {
        cors: {
            origin: appConfig.corsOrigin,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Content-Type, Accept,Authorization,X-Requested-With',
            credentials: true,
        },
    }),
    tslib_1.__metadata("design:paramtypes", [cache_service_1.CacheService,
        better_auth_service_1.BetterAuthService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map