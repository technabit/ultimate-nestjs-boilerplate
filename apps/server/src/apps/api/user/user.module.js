"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_resolver_1 = require("./user.resolver");
const user_service_1 = require("./user.service");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, user_resolver_1.UserResolver],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map