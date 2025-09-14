import { CacheService } from '../cache/cache.service';
import { SocketGateway } from './socket.gateway';
export declare class SocketService {
    private readonly socketGateway;
    private readonly cacheService;
    constructor(socketGateway: SocketGateway, cacheService: CacheService);
    sendTo(userId: string, event: string, data?: any): Promise<void>;
    sendToAll(event: string, data: any): Promise<void>;
}
