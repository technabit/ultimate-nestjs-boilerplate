import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

/**
 * Configuration flags for the Prisma logger / extension.
 */
export interface PrismaLoggingOptions {
  /** Master on/off switch */
  enabled: boolean;
  /** Warn when a single operation takes longer than this (ms) */
  slowQueryThresholdMs: number;
  /** Hide bind parameters / args from logs */
  redactParams: boolean;
  /** Truncate very long SQL / JSON argument strings */
  maxQueryLength: number;
  /** Base log level used (currently informational only) */
  level: 'debug' | 'log' | 'verbose' | 'warn' | 'error';
}

/**
 * Minimal shape of context Prisma passes to the $allOperations interceptor.
 * Operation names are strings like: findMany, findUnique, create, update, delete, etc.
 */
interface PrismaOperationContext<TArgs = unknown> {
  model?: string; // undefined for raw queries
  action: string; // Prisma operation name
  args: TArgs;
}

@Injectable()
export class PrismaLogger {
  private readonly logger = new Logger(PrismaLogger.name);
  constructor(private readonly options: PrismaLoggingOptions) {}

  asExtension() {
    // Prisma v5/v6 extension interception for all model operations.
    return Prisma.defineExtension((client) =>
      client.$extends({
        query: {
          $allModels: {
            // Use arrow function so lexical `this` refers to the PrismaLogger instance
            $allOperations: ({ model, operation, args, query }) => {
              if (!this.options.enabled) {
                return query(args);
              }
              const start = performance.now();
              const finish = (ok: boolean, error?: unknown) => {
                const duration = performance.now() - start;
                if (ok) {
                  this.logOperation(
                    {
                      model,
                      action: operation,
                      args,
                    } satisfies PrismaOperationContext,
                    duration,
                  );
                } else {
                  this.logError(
                    {
                      model,
                      action: operation,
                      args,
                    } satisfies PrismaOperationContext,
                    duration,
                    error instanceof Error ? error : new Error(String(error)),
                  );
                }
              };
              try {
                const result = query(args);
                if (
                  result &&
                  typeof (result as Promise<unknown>).then === 'function'
                ) {
                  return (result as Promise<unknown>)
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
              } catch (err) {
                finish(false, err);
                throw err;
              }
            },
          },
        },
      }),
    );
  }

  handleQueryEvent(e: Prisma.QueryEvent) {
    if (!this.options.enabled) return;
    const duration = e.duration; // ms
    const sql = this.shorten(e.query ?? '');
    const params = this.options.redactParams ? '[REDACTED]' : (e.params ?? '');
    if (duration >= this.options.slowQueryThresholdMs) {
      this.logger.warn(
        `Slow query detected (${duration}ms)\nSQL: ${sql}\nParams: ${params}`,
      );
    } else {
      this.logger.debug(`Query ${duration}ms: ${sql}`);
    }
  }

  private logOperation(params: PrismaOperationContext, duration: number) {
    const { model, action, args } = params;
    const base = `${model ?? 'raw'}.${action}`;
    const text = `${base} completed in ${duration.toFixed(1)}ms`;
    if (duration >= this.options.slowQueryThresholdMs) {
      this.logger.warn(text);
    } else {
      this.logger.debug(text);
    }
    if (!this.options.redactParams && typeof args !== 'undefined') {
      // JSON.stringify can throw (circular); guard just in case
      try {
        this.logger.verbose(
          `${base} args: ${this.shorten(JSON.stringify(args))}`,
        );
      } catch {
        this.logger.verbose(`${base} args: [Unserializable]`);
      }
    }
  }

  private logError(
    params: PrismaOperationContext,
    duration: number,
    err: Error,
  ) {
    const { model, action } = params;
    const base = `${model ?? 'raw'}.${action}`;
    const maybePrisma = err as Partial<{ code: string; meta: unknown }>;
    if (maybePrisma.code) {
      this.logger.error(
        `${base} failed in ${duration.toFixed(1)}ms (code=${maybePrisma.code})`,
      );
    } else {
      this.logger.error(`${base} failed in ${duration.toFixed(1)}ms`);
    }
  }

  private shorten(s: string): string {
    if (!s) return s;
    if (s.length <= this.options.maxQueryLength) return s;
    return `${s.slice(0, this.options.maxQueryLength)}…(truncated)`;
  }
}

export function resolvePrismaLoggingOptions(
  env: NodeJS.ProcessEnv,
): PrismaLoggingOptions {
  const enabledEnv =
    env.DATABASE_LOGGING === 'true' || env.APP_LOGGING === 'true';
  const slow = Number(env.PRISMA_LOG_SLOW_MS);
  const max = Number(env.PRISMA_MAX_QUERY_LENGTH);
  const redact = (env.PRISMA_REDACT_PARAMS ?? 'true').toLowerCase() !== 'false';
  return {
    enabled: enabledEnv,
    slowQueryThresholdMs: Number.isFinite(slow) ? slow : 200,
    redactParams: redact,
    maxQueryLength: Number.isFinite(max) ? max : 2000,
    level: 'debug',
  } as const;
}
