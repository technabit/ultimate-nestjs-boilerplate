"use strict";
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const better_auth_1 = require("better-auth");
const better_auth_config_1 = require("../config/auth/better-auth.config");
const auth_1 = require("../../../core/src/constants/auth");
const cache_module_1 = require("../shared/cache/cache.module");
const cache_service_1 = require("../shared/cache/cache.service");
const config_1 = require("@nestjs/config");
const plugins_1 = require("better-auth/plugins");
const auth_service_1 = require("./auth.service");
const better_auth_service_1 = require("./better-auth.service");
const HOOKS = [
    { metadataKey: auth_1.BEFORE_HOOK_KEY, hookType: 'before' },
    { metadataKey: auth_1.AFTER_HOOK_KEY, hookType: 'after' },
];
let AuthModule = AuthModule_1 = class AuthModule {
    auth;
    discoveryService;
    metadataScanner;
    adapter;
    logger = new common_1.Logger(this.constructor.name);
    constructor(auth, discoveryService, metadataScanner, adapter) {
        this.auth = auth;
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.adapter = adapter;
    }
    onModuleInit() {
        if (!this.auth.options.hooks)
            return;
        const providers = this.discoveryService
            .getProviders()
            .filter(({ metatype }) => metatype && Reflect.getMetadata(auth_1.HOOK_KEY, metatype));
        for (const provider of providers) {
            const providerPrototype = Object.getPrototypeOf(provider.instance);
            const methods = this.metadataScanner.getAllMethodNames(providerPrototype);
            for (const method of methods) {
                const providerMethod = providerPrototype[method];
                this.setupHooks(providerMethod);
            }
        }
    }
    configure(_) {
        let basePath = this.auth.options.basePath ?? '/api/auth';
        if (!basePath.startsWith('/')) {
            basePath = '/' + basePath;
        }
        if (basePath.endsWith('/')) {
            basePath = basePath.slice(0, -1);
        }
        this.adapter.httpAdapter.getInstance().all(`${basePath}/*`, async (request, reply) => {
            try {
                const url = new URL(request.url, `${request.protocol}://${request.hostname}`);
                const headers = new Headers();
                Object.entries(request.headers).forEach(([key, value]) => {
                    if (value)
                        headers.append(key, value.toString());
                });
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    body: request.body ? JSON.stringify(request.body) : undefined,
                });
                const response = await this.auth.handler(req);
                reply.status(response.status);
                response.headers.forEach((value, key) => reply.header(key, value));
                reply.send(response.body
                    ? await response.text()
                    : {
                        status: response.status,
                        message: response.statusText,
                    });
            }
            catch (error) {
                this.logger.fatal(`Better auth error ${String(error)}`);
                reply.status(500).send({
                    error: 'Internal authentication error',
                    code: 'AUTH_FAILURE',
                });
            }
        });
        this.logger.log(`AuthModule initialized at '${basePath}/*'`);
    }
    setupHooks(providerMethod) {
        if (!this.auth.options.hooks)
            return;
        for (const { metadataKey, hookType } of HOOKS) {
            const hookPath = Reflect.getMetadata(metadataKey, providerMethod);
            if (!hookPath)
                continue;
            const originalHook = this.auth.options.hooks[hookType];
            this.auth.options.hooks[hookType] = (0, plugins_1.createAuthMiddleware)(async (ctx) => {
                if (originalHook) {
                    await originalHook(ctx);
                }
                if (hookPath === ctx.path) {
                    await providerMethod(ctx);
                }
            });
        }
    }
    static forRootAsync() {
        return {
            global: true,
            module: AuthModule_1,
            imports: [cache_module_1.CacheModule],
            providers: [
                {
                    provide: auth_1.AUTH_INSTANCE_KEY,
                    useFactory: async (cacheService, configService, authService) => {
                        const config = (0, better_auth_config_1.getConfig)({
                            cacheService,
                            configService,
                            authService,
                        });
                        return (0, better_auth_1.betterAuth)(config);
                    },
                    inject: [cache_service_1.CacheService, config_1.ConfigService, auth_service_1.AuthService],
                },
                better_auth_service_1.BetterAuthService,
            ],
            exports: [auth_1.AUTH_INSTANCE_KEY, better_auth_service_1.BetterAuthService],
        };
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = AuthModule_1 = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        providers: [auth_service_1.AuthService],
        exports: [auth_service_1.AuthService],
    }),
    tslib_1.__param(0, (0, common_1.Inject)(auth_1.AUTH_INSTANCE_KEY)),
    tslib_1.__param(1, (0, common_1.Inject)(core_1.DiscoveryService)),
    tslib_1.__param(2, (0, common_1.Inject)(core_1.MetadataScanner)),
    tslib_1.__param(3, (0, common_1.Inject)(core_1.HttpAdapterHost)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.HttpAdapterHost])
], AuthModule);
//# sourceMappingURL=auth.module.js.map