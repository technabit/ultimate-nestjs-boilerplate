import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private isConnected;
    private connectionAttempts;
    private isShuttingDown;
    private readonly cfg;
    private metrics;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connectWithRetry;
    private gracefulShutdown;
    withTransaction<T>(fn: (tx: Omit<this, '$connect' | '$disconnect'>) => Promise<T>, options?: {
        maxRetries?: number;
    }): Promise<T>;
    healthCheck(): Promise<{
        status: 'up' | 'down';
        error?: string;
    }>;
    getMetrics(): {
        queryCount: number;
        totalDurationMs: number;
        avgDurationMs: number;
        uptimeMs: number;
    };
    get connected(): boolean;
}
