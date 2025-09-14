import { PrismaService } from '@/core/database/prisma/prisma.service';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
export declare class PrismaHealthIndicator extends HealthIndicator {
    private readonly prisma;
    constructor(prisma: PrismaService);
    pingCheck(key?: string, timeout?: number): Promise<HealthIndicatorResult>;
}
