"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreQueuesModule = void 0;
const tslib_1 = require("tslib");
const job_1 = require("../../../core/src/constants/job");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let CoreQueuesModule = class CoreQueuesModule {
};
exports.CoreQueuesModule = CoreQueuesModule;
exports.CoreQueuesModule = CoreQueuesModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: job_1.Queue.Email,
                streams: {
                    events: {
                        maxLen: 1000,
                    },
                },
            }),
        ],
        exports: [bullmq_1.BullModule],
    })
], CoreQueuesModule);
//# sourceMappingURL=queues.module.js.map