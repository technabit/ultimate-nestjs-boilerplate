import validateConfig from '@/core/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export type PrismaConfig = {
  logging: {
    enabled: boolean;
    slowQueryThresholdMs: number;
    redactParams: boolean;
    maxQueryLength: number;
  };
};

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsInt()
  @Min(0)
  PRISMA_LOG_SLOW_MS?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  PRISMA_MAX_QUERY_LENGTH?: number;

  @IsOptional()
  @IsBoolean()
  DATABASE_LOGGING?: boolean;

  @IsOptional()
  @IsBoolean()
  APP_LOGGING?: boolean;
}

export default registerAs<PrismaConfig>('prisma', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering PrismaConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  const enabled =
    process.env.DATABASE_LOGGING === 'true' ||
    process.env.APP_LOGGING === 'true';
  const slow = process.env.PRISMA_LOG_SLOW_MS
    ? parseInt(process.env.PRISMA_LOG_SLOW_MS, 10)
    : 200;
  const max = process.env.PRISMA_MAX_QUERY_LENGTH
    ? parseInt(process.env.PRISMA_MAX_QUERY_LENGTH, 10)
    : 2000;
  const redact =
    (process.env.PRISMA_REDACT_PARAMS ?? 'true').toLowerCase() !== 'false';

  return {
    logging: {
      enabled,
      slowQueryThresholdMs: Number.isFinite(slow) ? slow : 200,
      redactParams: redact,
      maxQueryLength: Number.isFinite(max) ? max : 2000,
    },
  } satisfies PrismaConfig;
});
