import { PrismaService } from '@/core/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async pingCheck(
    key = 'database',
    timeout = 5000,
  ): Promise<HealthIndicatorResult> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);
      // Simple query to validate connectivity
      await this.prisma.$queryRawUnsafe('SELECT 1');
      clearTimeout(timer);
      return this.getStatus(key, true);
    } catch (e) {
      throw new HealthCheckError('PrismaHealthIndicator failed', e as any);
    }
  }
}
