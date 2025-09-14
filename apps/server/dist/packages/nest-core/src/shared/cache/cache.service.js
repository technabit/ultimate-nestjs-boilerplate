"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const tslib_1 = require("tslib");
const cache_1 = require("../../../../core/src/constants/cache");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const util_1 = tslib_1.__importDefault(require("util"));
let CacheService = class CacheService {
    cacheManager;
    configService;
    constructor(cacheManager, configService) {
        this.cacheManager = cacheManager;
        this.configService = configService;
    }
    async get(keyParams) {
        return this.cacheManager.get(this._constructCacheKey(keyParams));
    }
    async getTtl(keyParams, options) {
        const ttl = await this.cacheManager.store.ttl(this._constructCacheKey(keyParams));
        if (!options?.disableResponseFilter && [-1, -2].includes(ttl)) {
            return null;
        }
        return ttl ?? null;
    }
    async set(keyParams, value, options) {
        const key = this._constructCacheKey(keyParams);
        await this.cacheManager.set(key, value, options?.ttl);
        return { key };
    }
    async storeGet(keyParams) {
        return this.cacheManager.store.get(this._constructCacheKey(keyParams));
    }
    async storeSet(keyParams, value, options) {
        const key = this._constructCacheKey(keyParams);
        await this.cacheManager.store.set(this._constructCacheKey(keyParams), value, options?.ttl);
        return { key };
    }
    async delete(keyParams) {
        const key = this._constructCacheKey(keyParams);
        await this.cacheManager.store.del(key);
        return { key };
    }
    _constructCacheKey(keyParams) {
        const prefix = this.configService.get('app.appPrefix', { infer: true });
        return util_1.default.format(`${prefix}:${cache_1.CacheKey[keyParams.key]}`, ...(keyParams.args ?? []));
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map