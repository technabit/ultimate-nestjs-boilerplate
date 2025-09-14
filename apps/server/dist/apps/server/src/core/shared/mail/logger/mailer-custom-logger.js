"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class MailerCustomLogger {
    logger;
    logLevels;
    static getInstance(logLevels) {
        const logger = new common_1.Logger(MailerCustomLogger.name);
        return new MailerCustomLogger(logger, logLevels);
    }
    constructor(logger, logLevels = [
        'trace',
        'debug',
        'info',
        'warn',
        'error',
        'fatal',
    ]) {
        this.logger = logger;
        this.logLevels = logLevels;
    }
    level(_level) { }
    trace(...params) {
        if (this.logLevels.includes('trace')) {
            this.logger.log(this.getPrefix(params[0]) + params[1], ...params.slice(2));
        }
    }
    debug(...params) {
        if (this.logLevels.includes('debug')) {
            this.logger.debug(this.getPrefix(params[0]) + params[1], ...params.slice(2));
        }
    }
    info(...params) {
        if (this.logLevels.includes('info')) {
            this.logger.log(this.getPrefix(params[0]) + params[1], ...params.slice(2));
        }
    }
    warn(...params) {
        if (this.logLevels.includes('warn')) {
            this.logger.warn(this.getPrefix(params[0]) + params[1], ...params.slice(2));
        }
    }
    error(...params) {
        if (this.logLevels.includes('error')) {
            this.logger.error(this.getPrefix(params[0]) + params[1], ...params.slice(2));
        }
    }
    fatal(...params) {
        if (this.logLevels.includes('fatal')) {
            this.logger.error(this.getPrefix(params[0]) + params[1], ...params.slice(2));
        }
    }
    log(message) {
        if (this.logLevels.includes('info')) {
            this.logger.log(message);
        }
    }
    getPrefix(entry) {
        let prefix = '';
        if (entry) {
            if (entry.tnx === 'server') {
                prefix = 'S: ';
            }
            else if (entry.tnx === 'client') {
                prefix = 'C: ';
            }
            if (entry.sid) {
                prefix = '[' + entry.sid + '] ' + prefix;
            }
            if (entry.cid) {
                prefix = '[#' + entry.cid + '] ' + prefix;
            }
        }
        return prefix;
    }
}
exports.default = MailerCustomLogger;
//# sourceMappingURL=mailer-custom-logger.js.map