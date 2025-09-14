import { IoAdapter } from '@nestjs/platform-socket.io';
import 'dotenv/config';
import { ServerOptions } from 'socket.io';
export declare class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions): any;
}
