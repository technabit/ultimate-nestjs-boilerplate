"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const email_events_1 = require("./email.events");
const email_processor_1 = require("./email.processor");
const email_service_1 = require("./email.service");
let EmailQueueModule = class EmailQueueModule {
};
exports.EmailQueueModule = EmailQueueModule;
exports.EmailQueueModule = EmailQueueModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [email_service_1.EmailQueueService, email_processor_1.EmailProcessor, email_events_1.EmailQueueEvents],
    })
], EmailQueueModule);
//# sourceMappingURL=email.module.js.map