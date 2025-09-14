"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const tslib_1 = require("tslib");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_factory_1 = tslib_1.__importDefault(require("./cache.factory"));
const cache_service_1 = require("./cache.service");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: cache_factory_1.default,
            }),
        ],
        providers: [cache_service_1.CacheService],
        exports: [cache_service_1.CacheService],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map