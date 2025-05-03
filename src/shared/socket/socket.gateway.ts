import { AuthGuard } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { UserSession } from '@/auth/types';
import { getConfig as getAppConfig } from '@/config/app.config';
import { CurrentUserSession } from '@/decorators/auth/current-user-session.decorator';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { fromNodeHeaders } from 'better-auth/node';
import 'dotenv/config';
import ms from 'ms';
import { Server, Socket } from 'socket.io';
import { CacheService } from '../cache/cache.service';

const appConfig = getAppConfig();

@WebSocketGateway(0, {
  cors: {
    origin: appConfig.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept,Authorization,X-Requested-With',
    credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  readonly logger = new Logger(this.constructor.name);

  @WebSocketServer()
  private server: Server;

  private readonly clients: Map<string, Socket>;

  constructor(
    private readonly cacheService: CacheService,
    private readonly authService: AuthService,
  ) {
    this.clients = new Map();
  }

  afterInit(): void {
    this.logger.log(`Websocket gateway initialized.`);
    this.server.use(async (socket: Socket, next) => {
      try {
        const session = await this.authService.api.getSession({
          headers: fromNodeHeaders(socket?.handshake?.headers),
        });
        if (!session) {
          throw new Error();
        }
        socket['session'] = session;
        return next();
      } catch {
        return next(
          new UnauthorizedException({
            code: 'UNAUTHORIZED',
          }),
        );
      }
    });
  }

  async handleConnection(socket: Socket) {
    // console.log('New client connected: ', socket?.id);
    const userId = socket?.['user']?.id as string;
    if (!userId) {
      return;
    }
    this.clients.set(socket?.id, socket);
    const userClients = await this.cacheService.get<string[]>({
      key: 'UserSocketClients',
      args: [userId],
    });
    const clients = new Set<string>(Array.from(userClients ?? []));
    clients.add(socket?.id);
    await this.cacheService.set(
      { key: 'UserSocketClients', args: [userId] },
      Array.from(clients),
      { ttl: ms('1h') },
    );
  }

  async handleDisconnect(socket: Socket) {
    // console.log('Client disconnected: ', socket?.id);

    this.clients.delete(socket?.id);
    const userId = socket?.['user']?.id as string;
    if (!userId) {
      return;
    }
    const userClients = await this.cacheService.get<string[]>({
      key: 'UserSocketClients',
      args: [userId],
    });
    const clients = new Set<string>(Array.from(userClients ?? []));
    if (clients.has(socket?.id)) {
      clients.delete(socket?.id);
      await this.cacheService.set(
        { key: 'UserSocketClients', args: [userId] },
        Array.from(clients),
        { ttl: ms('1h') },
      );
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() _message: any,
    @CurrentUserSession('user') _user: UserSession['user'],
  ) {
    // console.log(
    //   `Received message from client: ${socket?.id}.`,
    //   JSON.stringify(_message, null, 2),
    //   _user,
    // );
    socket.send('hello world');
  }

  @SubscribeMessage('ping')
  async handlePing(socket: Socket) {
    socket.send('pong');
  }

  getClient(clientId: string): Socket | undefined {
    return this.clients?.get(clientId);
  }

  getAllClients() {
    return this.clients;
  }
}
