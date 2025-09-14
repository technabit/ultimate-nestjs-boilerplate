import { Prisma } from '@prisma/client';
export interface PrismaLoggingOptions {
    enabled: boolean;
    slowQueryThresholdMs: number;
    redactParams: boolean;
    maxQueryLength: number;
    level: 'debug' | 'log' | 'verbose' | 'warn' | 'error';
}
export declare class PrismaLogger {
    private readonly options;
    private readonly logger;
    constructor(options: PrismaLoggingOptions);
    asExtension(): (client: any) => {
        $extends: {
            extArgs: {
                result: {};
                model: {};
                query: {};
                client: {};
            };
        };
    };
    handleQueryEvent(e: Prisma.QueryEvent): void;
    private logOperation;
    private logError;
    private shorten;
}
export declare function resolvePrismaLoggingOptions(env: NodeJS.ProcessEnv): PrismaLoggingOptions;
