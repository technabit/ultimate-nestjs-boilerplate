"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const tslib_1 = require("tslib");
const nest_core_1 = require("@app/nest-core");
const nest_core_2 = require("@app/nest-core");
const job_1 = require("../../../../../../packages/core/src/constants/job");
const nest_core_3 = require("@app/nest-core");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const terminus_1 = require("@nestjs/terminus");
const health_dto_1 = require("./dto/health.dto");
let HealthController = class HealthController {
    configService;
    health;
    http;
    db;
    microservice;
    authService;
    emailQueue;
    constructor(configService, health, http, db, microservice, authService, emailQueue) {
        this.configService = configService;
        this.health = health;
        this.http = http;
        this.db = db;
        this.microservice = microservice;
        this.authService = authService;
        this.emailQueue = emailQueue;
    }
    async check() {
        const list = [
            () => this.db.pingCheck('database', 5000),
            () => this.microservice.pingCheck('redis', {
                transport: microservices_1.Transport.REDIS,
                options: this.configService.getOrThrow('redis'),
            }),
        ];
        if (this.configService.get('app.nodeEnv', { infer: true }) !== 'production') {
            list.push(() => {
                const url = `${this.configService.getOrThrow('app.url', { infer: true })}${nest_core_3.SWAGGER_PATH}`;
                return this.http.pingCheck('api-docs', url, {
                    headers: this.authService.createBasicAuthHeaders(),
                });
            });
        }
        return this.health.check(list);
    }
    async queues() {
        const result = [];
        const queues = [
            { name: job_1.Queue.Email, q: this.emailQueue },
        ];
        for (const { name, q } of queues) {
            const counts = await q.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused', 'waiting-children');
            const baseUrl = this.configService.getOrThrow('app.url', { infer: true });
            const bullBoardUrl = `${baseUrl}/api${nest_core_2.BULL_BOARD_PATH}`;
            result.push({ name, counts: counts, bullBoardUrl });
        }
        return result;
    }
};
exports.HealthController = HealthController;
tslib_1.__decorate([
    (0, nest_core_3.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: health_dto_1.HealthCheckDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        type: nest_core_1.ErrorDto,
    }),
    (0, nest_core_3.Serialize)(health_dto_1.HealthCheckDto),
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
tslib_1.__decorate([
    (0, nest_core_3.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Queues overview' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: [health_dto_1.QueueOverviewDto] }),
    (0, common_1.Get)('queues'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HealthController.prototype, "queues", null);
exports.HealthController = HealthController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    tslib_1.__param(6, (0, bullmq_1.InjectQueue)(job_1.Queue.Email)),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService,
        terminus_1.HealthCheckService,
        terminus_1.HttpHealthIndicator,
        nest_core_3.PrismaHealthIndicator,
        terminus_1.MicroserviceHealthIndicator,
        nest_core_1.AuthService, Function])
], HealthController);
//# sourceMappingURL=health.controller.js.map