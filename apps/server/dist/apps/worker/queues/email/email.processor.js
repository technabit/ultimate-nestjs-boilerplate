"use strict";
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const tslib_1 = require("tslib");
const job_1 = require("../../../../../../../packages/core/src/constants/job");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const email_service_1 = require("./email.service");
const EmailJob = job_1.Job.Email;
let EmailProcessor = EmailProcessor_1 = class EmailProcessor extends bullmq_1.WorkerHost {
    emailQueueService;
    logger = new common_1.Logger(EmailProcessor_1.name);
    constructor(emailQueueService) {
        super();
        this.emailQueueService = emailQueueService;
    }
    async process(job, _token) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}.`);
        switch (job.name) {
            case EmailJob.EmailVerification:
                return await this.emailQueueService.verifyEmail(job.data);
            case EmailJob.SignInMagicLink:
                return await this.emailQueueService.sendMagicLink(job.data);
            case EmailJob.ResetPassword:
                return await this.emailQueueService.resetPassword(job.data);
            default:
                throw new Error(`Unhandled job named: ${job.name}`);
        }
    }
    async onActive(job) {
        this.logger.debug(`Job ${job.id} is now active`);
    }
    async onProgress(job) {
        this.logger.debug(`Job ${job.id} is ${job.progress}% complete`);
    }
    async onCompleted(job) {
        this.logger.debug(`Job ${job.id} has been completed`);
    }
    async onFailed(job) {
        this.logger.error(`Job ${job.id} has failed with reason: ${job.failedReason}`);
        this.logger.error(job.stacktrace);
    }
    async onStalled(job) {
        this.logger.error(`Job ${job.id} has been stalled`);
    }
    async onError(job, error) {
        this.logger.error(`Job ${job.id} has failed with error: ${error.message}`);
    }
};
exports.EmailProcessor = EmailProcessor;
tslib_1.__decorate([
    (0, bullmq_1.OnWorkerEvent)('active'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_2.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailProcessor.prototype, "onActive", null);
tslib_1.__decorate([
    (0, bullmq_1.OnWorkerEvent)('progress'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_2.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailProcessor.prototype, "onProgress", null);
tslib_1.__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_2.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailProcessor.prototype, "onCompleted", null);
tslib_1.__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_2.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailProcessor.prototype, "onFailed", null);
tslib_1.__decorate([
    (0, bullmq_1.OnWorkerEvent)('stalled'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_2.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailProcessor.prototype, "onStalled", null);
tslib_1.__decorate([
    (0, bullmq_1.OnWorkerEvent)('error'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_2.Job, Error]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailProcessor.prototype, "onError", null);
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = tslib_1.__decorate([
    (0, bullmq_1.Processor)(job_1.Queue.Email, {
        concurrency: 1,
        drainDelay: 300,
        stalledInterval: 300000,
        removeOnComplete: {
            age: 86400,
            count: 100,
        },
        limiter: {
            max: 1,
            duration: 150,
        },
    }),
    tslib_1.__metadata("design:paramtypes", [email_service_1.EmailQueueService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map