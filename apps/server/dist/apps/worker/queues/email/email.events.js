"use strict";
var EmailQueueEvents_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueEvents = void 0;
const tslib_1 = require("tslib");
const job_1 = require("../../../../../../../packages/core/src/constants/job");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let EmailQueueEvents = EmailQueueEvents_1 = class EmailQueueEvents extends bullmq_1.QueueEventsHost {
    logger = new common_1.Logger(EmailQueueEvents_1.name);
    onAdded(job) {
        this.logger.debug(`Job ${job.jobId} of type ${job.name} has been added to the queue.`);
    }
    onWaiting(job) {
        this.logger.debug(`Job ${job.jobId} is waiting`);
    }
};
exports.EmailQueueEvents = EmailQueueEvents;
tslib_1.__decorate([
    (0, bullmq_1.OnQueueEvent)('added'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], EmailQueueEvents.prototype, "onAdded", null);
tslib_1.__decorate([
    (0, bullmq_1.OnQueueEvent)('waiting'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], EmailQueueEvents.prototype, "onWaiting", null);
exports.EmailQueueEvents = EmailQueueEvents = EmailQueueEvents_1 = tslib_1.__decorate([
    (0, bullmq_1.QueueEventsListener)(job_1.Queue.Email, { blockingTimeout: 300000 })
], EmailQueueEvents);
//# sourceMappingURL=email.events.js.map