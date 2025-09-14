import validateConfig from '@/core/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { DatabaseConfig } from './database-config.type';

// Simple DB config shape for Better Auth and services
export enum DatabaseSSLMode {
  require = 'require',
  disable = 'disable',
}

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USERNAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING: boolean;

  @IsInt()
  @IsPositive()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsOptional()
  @IsEnum(DatabaseSSLMode)
  DATABASE_SSL_MODE: DatabaseSSLMode;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}

export function getConfig(): DatabaseConfig {
  // If DATABASE_URL is set, parse it; else use discrete vars
  const url = process.env.DATABASE_URL;
  let host = process.env.DATABASE_HOST;
  let port = process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432;
  let password = process.env.DATABASE_PASSWORD;
  let database = process.env.DATABASE_NAME;
  let username = process.env.DATABASE_USERNAME;

  if (url && url.startsWith('postgres')) {
    try {
      const u = new URL(url);
      host = u.hostname || host;
      port = u.port ? parseInt(u.port, 10) : port;
      username = decodeURIComponent(u.username || username || '');
      password = decodeURIComponent(u.password || password || '');
      database = (u.pathname || '').replace(/^\//, '') || database;
    } catch {
      // ignore invalid URL and fall back to discrete envs
    }
  }

  return {
    host: host!,
    port,
    password: password!,
    database: database!,
    username: username!,
    logging: process.env.DATABASE_LOGGING === 'true',
    poolSize: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.DATABASE_SSL_MODE === DatabaseSSLMode.require
        ? {
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
          }
        : undefined,
  };
}

export default registerAs<DatabaseConfig>('database', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering DatabaseConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
