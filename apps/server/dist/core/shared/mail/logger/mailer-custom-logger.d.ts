import { Logger } from '@nestjs/common';
import { LoggerLevel, Logger as NodeMailerLogger } from 'nodemailer/lib/shared';
declare class MailerCustomLogger implements NodeMailerLogger {
    private readonly logger;
    private readonly logLevels;
    static getInstance(logLevels?: LoggerLevel[]): MailerCustomLogger;
    constructor(logger: Logger, logLevels?: LoggerLevel[]);
    level(_level: LoggerLevel): void;
    trace(...params: any[]): void;
    debug(...params: any[]): void;
    info(...params: any[]): void;
    warn(...params: any[]): void;
    error(...params: any[]): void;
    fatal(...params: any[]): void;
    log(message: string): void;
    private getPrefix;
}
export default MailerCustomLogger;
