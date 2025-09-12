import { AuthService } from '@/core/auth/auth.service';
import { ErrorDto } from '@/core/common/dto/error.dto';
import { BULL_BOARD_PATH } from '@/core/config/bull/bull.config';
import { GlobalConfig } from '@/core/config/config.type';
import { Queue } from '@/core/constants/job.constant';
import { Public } from '@/core/decorators/public.decorator';
import { SWAGGER_PATH } from '@/core/tools/swagger/swagger.setup';
import { Serialize } from '@/core/utils/interceptors/serialize';
import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import type { Queue as BullQueue } from 'bullmq';
import { HealthCheckDto, QueueOverviewDto } from './dto/health.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService<GlobalConfig>,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly authService: AuthService,

    @InjectQueue(Queue.Email)
    private readonly emailQueue: BullQueue,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorDto,
  })
  @Serialize(HealthCheckDto)
  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const list = [
      () => this.db.pingCheck('database', { timeout: 5000 }),
      () =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: this.configService.getOrThrow('redis'),
        }),
    ];
    if (
      this.configService.get('app.nodeEnv', { infer: true }) !== 'production'
    ) {
      list.push(() => {
        const url = `${this.configService.getOrThrow('app.url', { infer: true })}${SWAGGER_PATH}`;
        return this.http.pingCheck('api-docs', url, {
          headers: this.authService.createBasicAuthHeaders(),
        });
      });
    }
    return this.health.check(list);
  }

  @Public()
  @ApiOperation({ summary: 'Queues overview' })
  @ApiResponse({ status: HttpStatus.OK, type: [QueueOverviewDto] })
  @Get('queues')
  async queues(): Promise<QueueOverviewDto[]> {
    const result: QueueOverviewDto[] = [];
    const queues: { name: string; q: BullQueue }[] = [
      { name: Queue.Email, q: this.emailQueue },
    ];

    for (const { name, q } of queues) {
      const counts = await q.getJobCounts(
        'waiting',
        'active',
        'completed',
        'failed',
        'delayed',
        'paused',
        'waiting-children',
      );
      const baseUrl = this.configService.getOrThrow('app.url', { infer: true });
      const bullBoardUrl = `${baseUrl}/api${BULL_BOARD_PATH}`;
      result.push({ name, counts: counts as any, bullBoardUrl });
    }
    return result;
  }
}
