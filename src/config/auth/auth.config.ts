import validateConfig from '@/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  AUTH_SECRET: string;
}

export function getConfig(): AuthConfig {
  return {
    authSecret: process.env.AUTH_SECRET,
  };
}

export default registerAs<AuthConfig>('auth', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering AuthConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
