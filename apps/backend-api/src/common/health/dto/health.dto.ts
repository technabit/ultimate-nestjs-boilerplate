import { ApiProperty } from '@nestjs/swagger';
import {
  HealthCheckResult,
  HealthCheckStatus,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class HealthCheckDto implements HealthCheckResult {
  @Expose()
  @ApiProperty()
  @IsString()
  status: HealthCheckStatus;

  @Expose()
  @ApiProperty()
  details: HealthIndicatorResult;
}

export class QueueCountsDto {
  @Expose()
  @ApiProperty()
  waiting: number;

  @Expose()
  @ApiProperty()
  active: number;

  @Expose()
  @ApiProperty()
  completed: number;

  @Expose()
  @ApiProperty()
  failed: number;

  @Expose()
  @ApiProperty()
  delayed: number;

  @Expose()
  @ApiProperty()
  paused: number;

  @Expose()
  @ApiProperty({ name: 'waiting-children' })
  waitingChildren: number;
}

export class QueueOverviewDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ type: QueueCountsDto })
  counts: QueueCountsDto;

  @Expose()
  @ApiProperty()
  bullBoardUrl: string;
}
