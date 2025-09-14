"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterAuthService = void 0;
const tslib_1 = require("tslib");
const auth_1 = require("../../../core/src/constants/auth");
const common_1 = require("@nestjs/common");
let BetterAuthService = class BetterAuthService {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    get api() {
        return this.auth.api;
    }
};
exports.BetterAuthService = BetterAuthService;
exports.BetterAuthService = BetterAuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(auth_1.AUTH_INSTANCE_KEY)),
    tslib_1.__metadata("design:paramtypes", [Object])
], BetterAuthService);
//# sourceMappingURL=better-auth.service.js.map