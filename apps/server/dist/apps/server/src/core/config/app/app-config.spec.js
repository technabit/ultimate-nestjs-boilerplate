"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_config_1 = tslib_1.__importDefault(require("./app.config"));
describe('AppConfig', () => {
    const originalEnv = { ...process.env };
    beforeEach(() => {
        process.env = { ...originalEnv };
    });
    beforeAll(() => {
        jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(console, 'info').mockImplementation();
    });
    describe('nodeEnv', () => {
        it('should return the value of NODE_ENV', async () => {
            process.env.NODE_ENV = 'development';
            const config = await (0, app_config_1.default)();
            expect(config.nodeEnv).toBe('development');
        });
        it('should return "development" when NODE_ENV is not set', async () => {
            delete process.env.NODE_ENV;
            const config = await (0, app_config_1.default)();
            expect(config.nodeEnv).toBe('development');
        });
        it('should throw an error when NODE_ENV is an invalid value', async () => {
            process.env.NODE_ENV = 'invalid';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
        it('should throw an error when NODE_ENV is an empty string', async () => {
            process.env.NODE_ENV = '';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
    });
    describe('name', () => {
        it('should return the value of APP_NAME', async () => {
            process.env.APP_NAME = 'My App';
            const config = await (0, app_config_1.default)();
            expect(config.name).toBe('My App');
        });
    });
    describe('url', () => {
        it('should return the value of APP_URL', async () => {
            process.env.APP_URL = 'https://example.com';
            const config = await (0, app_config_1.default)();
            expect(config.url).toBe('https://example.com');
        });
        it('should return undefined when APP_URL is not set', async () => {
            delete process.env.APP_URL;
            const config = await (0, app_config_1.default)();
            expect(config.url).toContain('http://localhost');
        });
        it('should throw an error when APP_URL is an invalid URL', async () => {
            process.env.APP_URL = 'http://///invalid-url';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
    });
    describe('port', () => {
        it('should throw error when APP_PORT is not set', async () => {
            delete process.env.APP_PORT;
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
        it('should return the value of APP_PORT as a number', async () => {
            process.env.APP_PORT = '3000';
            const config = await (0, app_config_1.default)();
            expect(config.port).toBe(3000);
        });
        it('should throw an error when APP_PORT is an invalid number', async () => {
            process.env.APP_PORT = 'invalid';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
        it('should throw an error when PORT is an invalid number', async () => {
            process.env.PORT = 'invalid';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
        it('should throw an error when APP_PORT is a negative number', async () => {
            process.env.APP_PORT = '-3000';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
        it('should throw an error when APP_PORT is greater than 65535', async () => {
            process.env.APP_PORT = '65536';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
    });
    describe('debug', () => {
        it('should return true when APP_DEBUG is "true"', async () => {
            process.env.APP_DEBUG = 'true';
            const config = await (0, app_config_1.default)();
            expect(config.debug).toBe(true);
        });
        it('should return false when APP_DEBUG is "false"', async () => {
            process.env.APP_DEBUG = 'false';
            const config = await (0, app_config_1.default)();
            expect(config.debug).toBe(false);
        });
        it('should return false when APP_DEBUG is empty', async () => {
            process.env.APP_DEBUG = '';
            const config = await (0, app_config_1.default)();
            expect(config.debug).toBe(false);
        });
    });
    describe('fallbackLanguage', () => {
        it('should return the value of APP_FALLBACK_LANGUAGE', async () => {
            process.env.APP_FALLBACK_LANGUAGE = 'en';
            const config = await (0, app_config_1.default)();
            expect(config.fallbackLanguage).toBe('en');
        });
        it('should return "en" when APP_FALLBACK_LANGUAGE is not set', async () => {
            delete process.env.APP_FALLBACK_LANGUAGE;
            const config = await (0, app_config_1.default)();
            expect(config.fallbackLanguage).toBe('en');
        });
        it('should throw an error when APP_FALLBACK_LANGUAGE is an empty string', async () => {
            process.env.APP_FALLBACK_LANGUAGE = '';
            const config = await (0, app_config_1.default)();
            expect(config.fallbackLanguage).toBe('en');
        });
    });
    describe('logLevel', () => {
        it('should return the value of APP_LOG_LEVEL', async () => {
            process.env.APP_LOG_LEVEL = 'info';
            const config = await (0, app_config_1.default)();
            expect(config.logLevel).toBe('info');
        });
        it('should return "warn" when APP_LOG_LEVEL is not set', async () => {
            delete process.env.APP_LOG_LEVEL;
            const config = await (0, app_config_1.default)();
            expect(config.logLevel).toBe('warn');
        });
        it('should throw an error when APP_LOG_LEVEL is an empty string', async () => {
            process.env.APP_LOG_LEVEL = '';
            const config = await (0, app_config_1.default)();
            expect(config.logLevel).toBe('warn');
        });
    });
    describe('logService', () => {
        it('should return the value of APP_LOG_SERVICE', async () => {
            process.env.APP_LOG_SERVICE = 'console';
            const config = await (0, app_config_1.default)();
            expect(config.logService).toBe('console');
        });
        it('should return "console" when APP_LOG_SERVICE is not set', async () => {
            delete process.env.APP_LOG_SERVICE;
            const config = await (0, app_config_1.default)();
            expect(config.logService).toBe('console');
        });
        it('should throw an error when APP_LOG_SERVICE is an empty string', async () => {
            process.env.APP_LOG_SERVICE = '';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
        it('should throw an error when APP_LOG_SERVICE is an invalid value', async () => {
            process.env.APP_LOG_SERVICE = 'invalid';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
    });
    describe('corsOrigin', () => {
        it('should return true when APP_CORS_ORIGIN is "true"', async () => {
            process.env.APP_CORS_ORIGIN = 'true';
            const config = await (0, app_config_1.default)();
            expect(config.corsOrigin).toBe(true);
        });
        it('should return false when APP_CORS_ORIGIN is "false"', async () => {
            process.env.APP_CORS_ORIGIN = 'false';
            const config = await (0, app_config_1.default)();
            expect(config.corsOrigin).toBe(false);
        });
        it('should return "*" when APP_CORS_ORIGIN is "*"', async () => {
            process.env.APP_CORS_ORIGIN = '*';
            const config = await (0, app_config_1.default)();
            expect(config.corsOrigin).toBe('*');
        });
        it('should return false when APP_CORS_ORIGIN is empty', async () => {
            process.env.APP_CORS_ORIGIN = '';
            const config = await (0, app_config_1.default)();
            expect(config.corsOrigin).toBe(false);
        });
        it('should return a single origin when APP_CORS_ORIGIN is a valid URL', async () => {
            process.env.APP_CORS_ORIGIN = 'https://example.com';
            const config = await (0, app_config_1.default)();
            expect(config.corsOrigin).toEqual([
                'https://example.com',
                'https://www.example.com',
            ]);
        });
        it('should return multiple origins when APP_CORS_ORIGIN is a comma-separated list of valid URLs', async () => {
            process.env.APP_CORS_ORIGIN = 'https://example.com,https://another.com';
            const config = await (0, app_config_1.default)();
            expect(config.corsOrigin).toEqual([
                'https://example.com',
                'https://another.com',
                'https://www.example.com',
                'https://www.another.com',
            ]);
        });
        it('should throw an error when APP_CORS_ORIGIN is an invalid value', async () => {
            process.env.APP_CORS_ORIGIN = '**';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
            process.env.APP_CORS_ORIGIN = 'https://example.com,';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
            process.env.APP_CORS_ORIGIN = 'https://example.com,,https://another.com';
            await expect(async () => await (0, app_config_1.default)()).rejects.toThrow(Error);
        });
    });
});
//# sourceMappingURL=app-config.spec.js.map