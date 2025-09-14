"use strict";
var PrismaLogger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaLogger = void 0;
exports.resolvePrismaLoggingOptions = resolvePrismaLoggingOptions;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaLogger = PrismaLogger_1 = class PrismaLogger {
    options;
    logger = new common_1.Logger(PrismaLogger_1.name);
    constructor(options) {
        this.options = options;
    }
    asExtension() {
        return client_1.Prisma.defineExtension((client) => client.$extends({
            query: {
                $allModels: {
                    $allOperations: ({ model, operation, args, query }) => {
                        if (!this.options.enabled) {
                            return query(args);
                        }
                        const start = performance.now();
                        const finish = (ok, error) => {
                            const duration = performance.now() - start;
                            if (ok) {
                                this.logOperation({
                                    model,
                                    action: operation,
                                    args,
                                }, duration);
                            }
                            else {
                                this.logError({
                                    model,
                                    action: operation,
                                    args,
                                }, duration, error instanceof Error ? error : new Error(String(error)));
                            }
                        };
                        try {
                            const result = query(args);
                            if (result &&
                                typeof result.then === 'function') {
                                return result
                                    .then((val) => {
                                    finish(true);
                                    return val;
                                })
                                    .catch((err) => {
                                    finish(false, err);
                                    throw err;
                                });
                            }
                            finish(true);
                            return result;
                        }
                        catch (err) {
                            finish(false, err);
                            throw err;
                        }
                    },
                },
            },
        }));
    }
    handleQueryEvent(e) {
        if (!this.options.enabled)
            return;
        const duration = e.duration;
        const sql = this.shorten(e.query ?? '');
        const params = this.options.redactParams ? '[REDACTED]' : (e.params ?? '');
        if (duration >= this.options.slowQueryThresholdMs) {
            this.logger.warn(`Slow query detected (${duration}ms)\nSQL: ${sql}\nParams: ${params}`);
        }
        else {
            this.logger.debug(`Query ${duration}ms: ${sql}`);
        }
    }
    logOperation(params, duration) {
        const { model, action, args } = params;
        const base = `${model ?? 'raw'}.${action}`;
        const text = `${base} completed in ${duration.toFixed(1)}ms`;
        if (duration >= this.options.slowQueryThresholdMs) {
            this.logger.warn(text);
        }
        else {
            this.logger.debug(text);
        }
        if (!this.options.redactParams && typeof args !== 'undefined') {
            try {
                this.logger.verbose(`${base} args: ${this.shorten(JSON.stringify(args))}`);
            }
            catch {
                this.logger.verbose(`${base} args: [Unserializable]`);
            }
        }
    }
    logError(params, duration, err) {
        const { model, action } = params;
        const base = `${model ?? 'raw'}.${action}`;
        const maybePrisma = err;
        if (maybePrisma.code) {
            this.logger.error(`${base} failed in ${duration.toFixed(1)}ms (code=${maybePrisma.code})`);
        }
        else {
            this.logger.error(`${base} failed in ${duration.toFixed(1)}ms`);
        }
    }
    shorten(s) {
        if (!s)
            return s;
        if (s.length <= this.options.maxQueryLength)
            return s;
        return `${s.slice(0, this.options.maxQueryLength)}…(truncated)`;
    }
};
exports.PrismaLogger = PrismaLogger;
exports.PrismaLogger = PrismaLogger = PrismaLogger_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], PrismaLogger);
function resolvePrismaLoggingOptions(env) {
    const enabledEnv = env.DATABASE_LOGGING === 'true' || env.APP_LOGGING === 'true';
    const slow = Number(env.PRISMA_LOG_SLOW_MS);
    const max = Number(env.PRISMA_MAX_QUERY_LENGTH);
    const redact = (env.PRISMA_REDACT_PARAMS ?? 'true').toLowerCase() !== 'false';
    return {
        enabled: enabledEnv,
        slowQueryThresholdMs: Number.isFinite(slow) ? slow : 200,
        redactParams: redact,
        maxQueryLength: Number.isFinite(max) ? max : 2000,
        level: 'debug',
    };
}
//# sourceMappingURL=prisma-logger.js.map