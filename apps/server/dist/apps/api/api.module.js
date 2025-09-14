"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const file_module_1 = require("./file/file.module");
const health_module_1 = require("./health/health.module");
const user_module_1 = require("./user/user.module");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [health_module_1.HealthModule, user_module_1.UserModule, file_module_1.FileModule],
    })
], ApiModule);
//# sourceMappingURL=api.module.js.map