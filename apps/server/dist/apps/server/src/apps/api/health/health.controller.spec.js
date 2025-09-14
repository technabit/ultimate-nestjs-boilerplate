"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../../../core/auth/auth.service");
const prisma_health_1 = require("../../../core/health/prisma.health");
const config_1 = require("@nestjs/config");
const terminus_1 = require("@nestjs/terminus");
const testing_1 = require("@nestjs/testing");
const health_controller_1 = require("./health.controller");
describe('HealthController', () => {
    let controller;
    let service;
    let configServiceValue;
    let healthCheckServiceValue;
    let httpUseValue;
    let dbUseValue;
    let microServiceValue;
    let authServiceValue;
    beforeAll(async () => {
        configServiceValue = {
            get: jest.fn(),
        };
        healthCheckServiceValue = {
            check: jest.fn(),
        };
        httpUseValue = {
            pingCheck: jest.fn(),
        };
        dbUseValue = {
            pingCheck: jest.fn(),
        };
        microServiceValue = {
            pingCheck: jest.fn(),
        };
        authServiceValue = {
            createBasicAuthHeaders: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [health_controller_1.HealthController],
            providers: [
                {
                    provide: config_1.ConfigService,
                    useValue: configServiceValue,
                },
                {
                    provide: terminus_1.HealthCheckService,
                    useValue: healthCheckServiceValue,
                },
                {
                    provide: terminus_1.HttpHealthIndicator,
                    useValue: httpUseValue,
                },
                { provide: prisma_health_1.PrismaHealthIndicator, useValue: dbUseValue },
                {
                    provide: terminus_1.MicroserviceHealthIndicator,
                    useValue: microServiceValue,
                },
                {
                    provide: auth_service_1.AuthService,
                    useValue: authServiceValue,
                },
            ],
        }).compile();
        controller = module.get(health_controller_1.HealthController);
        service = module.get(terminus_1.HealthCheckService);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
    describe('check', () => {
        it('should return health check result', async () => {
            const healthCheckResult = {
                status: 'ok',
                info: {
                    db: {
                        status: 'up',
                    },
                    redis: { status: 'up' },
                    http: {
                        status: 'up',
                    },
                },
                error: {},
            };
            healthCheckServiceValue.check.mockReturnValue(healthCheckResult);
            const result = await controller.check();
            expect(result).toEqual(healthCheckResult);
            expect(healthCheckServiceValue.check).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=health.controller.spec.js.map