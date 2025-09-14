"use strict";
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_logger_1 = require("./prisma-logger");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    configService;
    logger = new common_1.Logger(PrismaService_1.name);
    isConnected = false;
    connectionAttempts = 0;
    isShuttingDown = false;
    cfg;
    metrics = {
        queryCount: 0,
        totalDurationMs: 0,
        startedAt: Date.now(),
    };
    constructor(configService) {
        const urlFromEnv = process.env.DATABASE_URL;
        const dbCfg = configService.get('database', {
            infer: true,
        });
        const host = dbCfg?.host ?? 'localhost';
        const port = dbCfg?.port ?? 5432;
        const user = dbCfg?.username ?? 'postgres';
        const pass = dbCfg?.password ?? 'postgres';
        const db = dbCfg?.database ?? 'postgres';
        const hasSsl = !!dbCfg?.ssl;
        const rejectUnauthorized = dbCfg?.ssl?.rejectUnauthorized;
        const searchParams = [];
        if (hasSsl) {
            searchParams.push('sslmode=require');
            if (typeof rejectUnauthorized === 'boolean') {
                searchParams.push(`rejectUnauthorized=${rejectUnauthorized}`);
            }
        }
        const query = searchParams.length ? `?${searchParams.join('&')}` : '';
        const fallbackUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}${query}`;
        super({
            datasources: {
                db: {
                    url: urlFromEnv || fallbackUrl,
                },
            },
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'error' },
                { emit: 'stdout', level: 'warn' },
            ],
        });
        this.configService = configService;
        const prismaCfg = this.configService.get('prisma', {
            infer: true,
        });
        const prismaLogger = new prisma_logger_1.PrismaLogger({
            enabled: prismaCfg?.logging?.enabled ?? false,
            slowQueryThresholdMs: prismaCfg?.logging?.slowQueryThresholdMs ?? 200,
            redactParams: prismaCfg?.logging?.redactParams ?? true,
            maxQueryLength: prismaCfg?.logging?.maxQueryLength ?? 2000,
            level: 'debug',
        });
        this.$extends(prismaLogger.asExtension());
        this.$on('query', (e) => {
            prismaLogger.handleQueryEvent(e);
            try {
                this.metrics.queryCount += 1;
                if (typeof e.duration === 'number') {
                    this.metrics.totalDurationMs += e.duration;
                }
            }
            catch {
            }
        });
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
        };
    }
    async onModuleInit() {
        if (this.cfg.prisma.skipConnect) {
            this.logger.warn('Skipping Prisma connect due to PRISMA_SKIP_CONNECT=true');
            return;
        }
        await this.connectWithRetry();
    }
    async onModuleDestroy() {
        await this.gracefulShutdown();
    }
    async connectWithRetry() {
        const maxRetries = this.cfg.connection.maxRetries;
        const retryDelay = this.cfg.connection.retryDelay;
        for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
            try {
                this.connectionAttempts = attempt;
                await this.$connect();
                this.isConnected = true;
                this.logger.log(`Prisma connected successfully ${attempt > 1 ? `after ${attempt - 1} retries` : ''}`);
                return;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                if (attempt > maxRetries) {
                    this.logger.error(`Failed to connect to database after ${maxRetries} retries: ${errorMessage}`);
                    throw error;
                }
                this.logger.warn(`Database connection attempt ${attempt} failed: ${errorMessage}. Retrying in ${retryDelay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }
    }
    async gracefulShutdown() {
        if (this.isShuttingDown) {
            this.logger.warn('Shutdown already in progress');
            return;
        }
        this.isShuttingDown = true;
        this.logger.log('Starting graceful database shutdown...');
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            await this.$disconnect();
            this.isConnected = false;
            this.logger.log('Prisma disconnected gracefully');
        }
        catch (err) {
            this.logger.error('Error during graceful shutdown:', err);
            throw err;
        }
        finally {
            this.isShuttingDown = false;
        }
    }
    async withTransaction(fn, options = {}) {
        const max = options.maxRetries ?? 2;
        let attempt = 0;
        for (;;) {
            try {
                return await this.$transaction(async (txClient) => fn(txClient));
            }
            catch (err) {
                attempt += 1;
                const code = err?.code;
                if (attempt <= max && (code === '40001' || code === '40P01')) {
                    this.logger.warn(`Transaction conflict (code=${code}); retrying attempt ${attempt}/${max}`);
                    continue;
                }
                throw err;
            }
        }
    }
    async healthCheck() {
        try {
            await this.$queryRawUnsafe('SELECT 1');
            return { status: 'up' };
        }
        catch (e) {
            return { status: 'down', error: e.message };
        }
    }
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
    get connected() {
        return this.isConnected;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map