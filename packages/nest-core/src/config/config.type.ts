import { AuthConfig } from '@/core/config/auth/auth-config.type';
import { AwsConfig } from '@/core/config/aws/aws-config.types';
import { DatabaseConfig } from '@/core/config/database/database-config.type';
import { GrafanaConfig } from '@/core/config/grafana/grafana.type';
import { GraphqlConfig } from '@/core/config/graphql/graphql-config.type';
import { MailConfig } from '@/core/config/mail/mail-config.type';
import { PrismaConfig } from '@/core/config/prisma/prisma.config';
import { RedisConfig } from '@/core/config/redis/redis-config.type';
import { SentryConfig } from '@/core/config/sentry/sentry-config.type';
import { ThrottlerConfig } from '@/core/config/throttler/throttler-config.type';
import { AppConfig } from './app/app-config.type';
import { BullConfig } from './bull/bull-config.type';

// IMPORTANT: When adding a new config module via registerAs(),
// declare its type here so ConfigService<GlobalConfig> stays accurate.
export type GlobalConfig = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  auth: AuthConfig;
  mail: MailConfig;
  sentry: SentryConfig;
  queue: BullConfig;
  throttler: ThrottlerConfig;
  aws: AwsConfig;
  grafana: GrafanaConfig;
  prisma: PrismaConfig;
  graphql: GraphqlConfig;
};
