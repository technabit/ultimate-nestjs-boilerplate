import validateConfig from '@/core/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  AUTH_SECRET: string;

  @IsString()
  @IsOptional()
  BASIC_AUTH_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  BASIC_AUTH_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  GITHUB_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  GITHUB_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  TRUSTED_ORIGINS: string;

  @IsString()
  @IsOptional()
  COOKIE_PREFIX: string;
}

export function getConfig(): AuthConfig {
  return {
    authSecret: process.env.AUTH_SECRET,
    basicAuth: {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD,
    },
    oAuth: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      },
    },
    trustedOrigins: process.env.TRUSTED_ORIGINS
      ? process.env.TRUSTED_ORIGINS.split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          '*.dev.local',
        ],
    cookiePrefix: process.env.COOKIE_PREFIX ?? 'r5FrNpVFQr4vt2kKD6f4yaUJ',
  };
}

export default registerAs<AuthConfig>('auth', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering AuthConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
