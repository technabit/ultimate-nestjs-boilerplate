import { HealthCheckResult, HealthCheckStatus, HealthIndicatorResult } from '@nestjs/terminus';
export declare class HealthCheckDto implements HealthCheckResult {
    status: HealthCheckStatus;
    details: HealthIndicatorResult;
}
export declare class QueueCountsDto {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
    waitingChildren: number;
}
export declare class QueueOverviewDto {
    name: string;
    counts: QueueCountsDto;
    bullBoardUrl: string;
}
