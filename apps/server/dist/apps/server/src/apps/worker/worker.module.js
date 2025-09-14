"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const email_module_1 = require("./queues/email/email.module");
let WorkerModule = class WorkerModule {
};
exports.WorkerModule = WorkerModule;
exports.WorkerModule = WorkerModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [email_module_1.EmailQueueModule],
    })
], WorkerModule);
//# sourceMappingURL=worker.module.js.map