import { BetterAuthService } from '@/core/auth/better-auth.service';
import { CurrentUserSession } from '@/core/decorators/auth/current-user-session.decorator';
import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import 'dotenv/config';
import { Socket } from 'socket.io';
import { CacheService } from '../cache/cache.service';
type SocketWithUserSession = Socket & {
    session: CurrentUserSession;
};
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly cacheService;
    private readonly betterAuthService;
    readonly logger: Logger;
    private server;
    private readonly clients;
    constructor(cacheService: CacheService, betterAuthService: BetterAuthService);
    afterInit(): void;
    handleConnection(socket: SocketWithUserSession): Promise<void>;
    handleDisconnect(socket: SocketWithUserSession): Promise<void>;
    handleMessage(socket: SocketWithUserSession, _message: any, _user: CurrentUserSession['user']): void;
    handlePing(socket: SocketWithUserSession): Promise<void>;
    getClient(clientId: string): Socket | undefined;
    getAllClients(): Map<string, Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>>;
}
export {};
