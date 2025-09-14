"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const tslib_1 = require("tslib");
const auth_service_1 = require("@app/nest-core/auth/auth.service");
const error_dto_1 = require("@app/nest-core/common/dto/error.dto");
const bull_config_1 = require("@app/nest-core/config/bull/bull.config");
const job_1 = require("@core/constants/job");
const public_decorator_1 = require("@app/nest-core/decorators/public.decorator");
const prisma_health_1 = require("@app/nest-core/health/prisma.health");
const swagger_setup_1 = require("@app/nest-core/tools/swagger/swagger.setup");
const serialize_1 = require("@app/nest-core/utils/interceptors/serialize");
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
                const url = `${this.configService.getOrThrow('app.url', { infer: true })}${swagger_setup_1.SWAGGER_PATH}`;
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
            const bullBoardUrl = `${baseUrl}/api${bull_config_1.BULL_BOARD_PATH}`;
            result.push({ name, counts: counts, bullBoardUrl });
        }
        return result;
    }
};
exports.HealthController = HealthController;
tslib_1.__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: health_dto_1.HealthCheckDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        type: error_dto_1.ErrorDto,
    }),
    (0, serialize_1.Serialize)(health_dto_1.HealthCheckDto),
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
tslib_1.__decorate([
    (0, public_decorator_1.Public)(),
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
        terminus_1.HttpHealthIndicator, typeof (_a = typeof prisma_health_1.PrismaHealthIndicator !== "undefined" && prisma_health_1.PrismaHealthIndicator) === "function" ? _a : Object, terminus_1.MicroserviceHealthIndicator, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object, Function])
], HealthController);
//# sourceMappingURL=health.controller.js.map