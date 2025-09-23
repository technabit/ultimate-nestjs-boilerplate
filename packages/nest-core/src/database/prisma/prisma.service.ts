import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaLogger } from './prisma-logger';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Resolve PrismaClient at runtime from the consumer app to avoid bundling a separate client

const { PrismaClient: RuntimePrismaClient }: any = require('@prisma/client');

@Injectable()
export class PrismaService
  extends (RuntimePrismaClient as new (...args: any[]) => any)
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  private isConnected = false;
  private isShuttingDown = false;
  private pgPool: Pool | null = null;

  // Internal configuration (not exposed directly)
  private readonly cfg: {
    prisma: { skipConnect: boolean };
    connection: { maxRetries: number; retryDelay: number };
    metrics: { enabled: boolean };
  };

  // Basic metrics aggregation (in-memory)
  private metrics = {
    queryCount: 0,
    totalDurationMs: 0,
    startedAt: Date.now(),
  };

  constructor(private readonly configService: ConfigService) {
    const urlFromEnv = process.env.DATABASE_URL; // Prisma CLI still reads this for migrations

    // Build connection URL consistently from ConfigService (database config)
    const dbCfg = (configService as ConfigService).get('database', {
      infer: true,
    }) as any;

    const host = dbCfg?.host ?? 'localhost';
    const port = dbCfg?.port ?? 5432;
    const user = dbCfg?.username ?? 'postgres';
    const pass = dbCfg?.password ?? 'postgres';
    const db = dbCfg?.database ?? 'postgres';
    const hasSsl = !!dbCfg?.ssl;
    const rejectUnauthorized = dbCfg?.ssl?.rejectUnauthorized;

    const searchParams: string[] = [];

    if (hasSsl) {
      searchParams.push('sslmode=require');
      if (typeof rejectUnauthorized === 'boolean') {
        searchParams.push(`rejectUnauthorized=${rejectUnauthorized}`);
      }
    }

    const query = searchParams.length ? `?${searchParams.join('&')}` : '';

    const fallbackUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(
      pass,
    )}@${host}:${port}/${db}${query}`;

    // Use Prisma driver adapter for node-postgres shared Pool
    const pool = new Pool({
      connectionString: urlFromEnv || fallbackUrl,
      ssl: hasSsl
        ? typeof rejectUnauthorized === 'boolean'
          ? { rejectUnauthorized }
          : true
        : undefined,
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    this.pgPool = pool;

    // Configure structured Prisma logging & middleware
    const prismaCfg = (this.configService as ConfigService).get('prisma', {
      infer: true,
    }) as any;

    const prismaLogger = new PrismaLogger({
      enabled: prismaCfg?.logging?.enabled ?? false,
      slowQueryThresholdMs: prismaCfg?.logging?.slowQueryThresholdMs ?? 200,
      redactParams: prismaCfg?.logging?.redactParams ?? true,
      maxQueryLength: prismaCfg?.logging?.maxQueryLength ?? 2000,
      level: 'debug',
    });

    // Tap into query events when enabled and collect basic metrics
    this.$on('query' as any, (e: any) => {
      prismaLogger.handleQueryEvent(e);
      try {
        this.metrics.queryCount += 1;
        if (typeof e.duration === 'number') {
          this.metrics.totalDurationMs += e.duration;
        }
      } catch {
        // swallow metrics errors
      }
    });

    // Build internal cfg (env overrides)
    this.cfg = {
      prisma: {
        skipConnect: (process.env.PRISMA_SKIP_CONNECT ?? 'false') === 'true',
      },
      connection: {
        maxRetries: process.env.PRISMA_MAX_RETRIES
          ? parseInt(process.env.PRISMA_MAX_RETRIES, 10)
          : 5,
        retryDelay: process.env.PRISMA_RETRY_DELAY_MS
          ? parseInt(process.env.PRISMA_RETRY_DELAY_MS, 10)
          : 1500,
      },
      metrics: {
        enabled: (process.env.PRISMA_METRICS_ENABLED ?? 'true') !== 'false',
      },
    } as const;
  }

  async onModuleInit(): Promise<void> {
    // Allow tests/sandboxes to skip DB connect
    if (this.cfg.prisma.skipConnect) {
      this.logger.warn(
        'Skipping Prisma connect due to PRISMA_SKIP_CONNECT=true',
      );
      return;
    }
    await this.connectWithRetry();
  }

  async onModuleDestroy(): Promise<void> {
    await this.gracefulShutdown();
  }

  /**
   * Connect with retry logic
   */
  private async connectWithRetry(): Promise<void> {
    const maxRetries = this.cfg.connection.maxRetries;
    const retryDelay = this.cfg.connection.retryDelay;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        await this.$connect();
        this.isConnected = true;
        this.logger.log(
          `Prisma connected successfully ${attempt > 1 ? `after ${attempt - 1} retries` : ''}`,
        );
        return;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        if (attempt > maxRetries) {
          this.logger.error(
            `Failed to connect to database after ${maxRetries} retries: ${errorMessage}`,
          );
          throw error;
        }

        this.logger.warn(
          `Database connection attempt ${attempt} failed: ${errorMessage}. Retrying in ${retryDelay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  /**
   * Enhanced graceful shutdown with connection draining
   */
  private async gracefulShutdown(): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('Shutdown already in progress');
      return;
    }

    this.isShuttingDown = true;
    this.logger.log('Starting graceful database shutdown...');

    try {
      // Wait for ongoing operations to complete (simplified)
      // In production, you might want to track active operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      await this.$disconnect();
      this.isConnected = false;
      this.logger.log('Prisma disconnected gracefully');

      if (this.pgPool) {
        await this.pgPool.end();
        this.logger.log('PostgreSQL pool closed');
      }
    } catch (err) {
      this.logger.error('Error during graceful shutdown:', err as Error);
      throw err;
    } finally {
      this.isShuttingDown = false;
    }
  }

  /**
   * Execute operations inside a transaction with automatic retries for serialization failures.
   */
  async withTransaction<T>(
    fn: (tx: Omit<this, '$connect' | '$disconnect'>) => Promise<T>,
    options: { maxRetries?: number } = {},
  ): Promise<T> {
    const max = options.maxRetries ?? 2;
    let attempt = 0;
    for (;;) {
      try {
        return await this.$transaction(async (txClient) => fn(txClient as any));
      } catch (err) {
        attempt += 1;
        const code = (err as any)?.code;
        // Retry on common serialization / deadlock codes (Postgres specific)
        if (attempt <= max && (code === '40001' || code === '40P01')) {
          this.logger.warn(
            `Transaction conflict (code=${code}); retrying attempt ${attempt}/${max}`,
          );
          continue;
        }
        throw err;
      }
    }
  }

  /** Lightweight health check (optionally used outside Terminus) */
  async healthCheck(): Promise<{ status: 'up' | 'down'; error?: string }> {
    try {
      await this.$queryRawUnsafe('SELECT 1');
      return { status: 'up' };
    } catch (e) {
      return { status: 'down', error: (e as Error).message };
    }
  }

  /** Return shallow metrics snapshot */
  getMetrics() {
    const { queryCount, totalDurationMs, startedAt } = this.metrics;
    const uptimeMs = Date.now() - startedAt;
    const avg = queryCount ? totalDurationMs / queryCount : 0;
    return {
      queryCount,
      totalDurationMs,
      avgDurationMs: Number(avg.toFixed(2)),
      uptimeMs,
    };
  }

  /** Whether Prisma reports an active connection (best-effort). */
  get connected() {
    return this.isConnected;
  }
}
