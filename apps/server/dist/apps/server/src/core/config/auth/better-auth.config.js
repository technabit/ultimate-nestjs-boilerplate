"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const username_1 = require("../../utils/validators/username");
const api_1 = require("better-auth/api");
const plugins_1 = require("better-auth/plugins");
const passkey_1 = require("better-auth/plugins/passkey");
const pg_1 = require("pg");
const uuid_1 = require("uuid");
function getConfig({ configService, cacheService, authService, }) {
    const appConfig = configService.getOrThrow('app', { infer: true });
    const databaseConfig = configService.getOrThrow('database', { infer: true });
    const authConfig = configService.getOrThrow('auth', { infer: true });
    const plugins = [
        (0, plugins_1.username)({ usernameValidator: username_1.validateUsername }),
        (0, plugins_1.magicLink)({
            disableSignUp: true,
            async sendMagicLink({ email, url }) {
                try {
                    await authService.sendSigninMagicLink({ email, url });
                }
                catch (error) {
                    throw new api_1.APIError(error.status, {
                        status: error.status,
                        message: error.message,
                    });
                }
            },
        }),
        (0, plugins_1.twoFactor)(),
        (0, passkey_1.passkey)({
            rpName: appConfig.name,
        }),
    ];
    const nonProdPlugins = [(0, plugins_1.openAPI)()];
    if (appConfig.nodeEnv !== 'production') {
        plugins.push(...nonProdPlugins);
    }
    return {
        appName: appConfig.name,
        secret: authConfig.authSecret,
        baseURL: appConfig.url,
        plugins,
        database: new pg_1.Pool({
            database: databaseConfig.database,
            user: databaseConfig.username,
            password: databaseConfig.password,
            host: databaseConfig.host,
            port: databaseConfig.port,
            ...(typeof databaseConfig.ssl === 'object'
                ? {
                    ssl: {
                        rejectUnauthorized: databaseConfig.ssl?.rejectUnauthorized,
                        ca: databaseConfig.ssl?.ca,
                        key: databaseConfig.ssl?.key,
                        cert: databaseConfig.ssl?.cert,
                    },
                }
                : {}),
        }),
        emailAndPassword: {
            enabled: true,
            autoSignIn: false,
            requireEmailVerification: true,
            sendResetPassword: async ({ url, user }) => {
                try {
                    await authService.resetPassword({ url, userId: user.id });
                }
                catch (error) {
                    throw new api_1.APIError(error.status, {
                        status: error.status,
                        message: error.message,
                    });
                }
            },
        },
        session: {
            freshAge: 0,
            modelName: 'session',
        },
        user: {
            modelName: 'user',
            fields: {
                name: 'firstName',
                emailVerified: 'isEmailVerified',
            },
        },
        account: {
            modelName: 'account',
        },
        verification: {
            modelName: 'verification',
        },
        emailVerification: {
            sendVerificationEmail: async ({ user, url }) => {
                try {
                    await authService.verifyEmail({ url, userId: user.id });
                }
                catch (error) {
                    throw new api_1.APIError(error.status, {
                        status: error.status,
                        message: error.message,
                    });
                }
            },
        },
        trustedOrigins: appConfig.corsOrigin,
        socialProviders: {
            ...(authConfig.oAuth.github?.clientId &&
                authConfig.oAuth.github?.clientSecret
                ? {
                    github: {
                        clientId: authConfig.oAuth.github?.clientId,
                        clientSecret: authConfig.oAuth.github?.clientSecret,
                        mapProfileToUser(profile) {
                            return {
                                email: profile.email,
                                name: profile.login,
                                username: profile.login,
                                emailVerified: true,
                                image: profile.avatar_url,
                            };
                        },
                    },
                }
                : {}),
        },
        advanced: {
            database: {
                generateId() {
                    return (0, uuid_1.v4)();
                },
            },
            cookiePrefix: 'TmVzdEpTIEJvaWxlcnBsYXRl',
        },
        secondaryStorage: {
            get: async (key) => {
                return ((await cacheService.get({ key: 'AccessToken', args: [key] })) ?? null);
            },
            set: async (key, value, ttl) => {
                await cacheService.set({ key: 'AccessToken', args: [key] }, value, ttl
                    ? {
                        ttl: ttl * 1000,
                    }
                    : {});
            },
            delete: async (key) => {
                await cacheService.delete({ key: 'AccessToken', args: [key] });
            },
        },
    };
}
//# sourceMappingURL=better-auth.config.js.map