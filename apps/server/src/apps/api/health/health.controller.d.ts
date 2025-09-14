import { AuthService } from '@app/nest-core/auth/auth.service';
import { GlobalConfig } from '@app/nest-core/config/config.type';
import { PrismaHealthIndicator } from '@app/nest-core/health/prisma.health';
import { ConfigService } from '@nestjs/config';
import { HealthCheckResult, HealthCheckService, HttpHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import type { Queue as BullQueue } from 'bullmq';
import { QueueOverviewDto } from './dto/health.dto';
export declare class HealthController {
    private readonly configService;
    private readonly health;
    private readonly http;
    private readonly db;
    private readonly microservice;
    private readonly authService;
    private readonly emailQueue;
    constructor(configService: ConfigService<GlobalConfig>, health: HealthCheckService, http: HttpHealthIndicator, db: PrismaHealthIndicator, microservice: MicroserviceHealthIndicator, authService: AuthService, emailQueue: BullQueue);
    check(): Promise<HealthCheckResult>;
    queues(): Promise<QueueOverviewDto[]>;
}
