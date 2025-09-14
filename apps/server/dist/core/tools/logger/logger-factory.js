"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLoggingConfig = consoleLoggingConfig;
const app_1 = require("../../../../../../packages/core/src/constants/app");
const uuid_1 = require("uuid");
const PinoLevelToGoogleLoggingSeverityLookup = Object.freeze({
    trace: 'DEBUG',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'CRITICAL',
});
const genReqId = (req, res) => {
    const id = req.headers['x-request-id'] || (0, uuid_1.v4)();
    res.setHeader('X-Request-Id', id.toString());
    return id;
};
const customSuccessMessage = (req, res, responseTime) => {
    return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`;
};
const customReceivedMessage = (req) => {
    return `[${req.id || '*'}] "${req.method} ${req.url}"`;
};
const customErrorMessage = (req, res, err) => {
    return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`;
};
function logServiceConfig(logService) {
    switch (logService) {
        case app_1.LogService.GoogleLogging:
            return googleLoggingConfig();
        case app_1.LogService.AwsCloudWatch:
            return cloudwatchLoggingConfig();
        case app_1.LogService.Console:
        default:
            return consoleLoggingConfig();
    }
}
function cloudwatchLoggingConfig() {
    return {
        messageKey: 'message',
    };
}
function googleLoggingConfig() {
    return {
        messageKey: 'message',
        formatters: {
            level(label, number) {
                return {
                    severity: PinoLevelToGoogleLoggingSeverityLookup[label] ||
                        PinoLevelToGoogleLoggingSeverityLookup['info'],
                    level: number,
                };
            },
        },
    };
}
function consoleLoggingConfig() {
    return {
        messageKey: 'msg',
        transport: {
            target: 'pino-pretty',
            options: {
                singleLine: true,
                ignore: 'req.id,req.headers,req.remoteAddress,req.remotePort,res.headers',
            },
        },
    };
}
async function useLoggerFactory(configService) {
    const logLevel = configService.get('app.logLevel', { infer: true });
    const logService = configService.get('app.logService', { infer: true });
    const isDebug = configService.get('app.debug', { infer: true });
    const pinoHttpOptions = {
        level: logLevel,
        genReqId: isDebug ? genReqId : undefined,
        serializers: isDebug
            ? {
                req: (req) => {
                    req.body = req.raw.body;
                    return req;
                },
            }
            : undefined,
        customSuccessMessage,
        customReceivedMessage,
        customErrorMessage,
        redact: {
            paths: app_1.loggingRedactPaths,
            censor: '**GDPR COMPLIANT**',
        },
        ...logServiceConfig(logService),
    };
    return {
        pinoHttp: pinoHttpOptions,
    };
}
exports.default = useLoggerFactory;
//# sourceMappingURL=logger-factory.js.map