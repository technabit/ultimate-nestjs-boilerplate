"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthModule = void 0;
const tslib_1 = require("tslib");
const nest_core_1 = require("@app/nest-core");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const health_controller_1 = require("./health.controller");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [terminus_1.TerminusModule, axios_1.HttpModule, nest_core_1.SocketModule],
        controllers: [health_controller_1.HealthController],
        providers: [nest_core_1.PrismaHealthIndicator],
    })
], HealthModule);
//# sourceMappingURL=health.module.js.map