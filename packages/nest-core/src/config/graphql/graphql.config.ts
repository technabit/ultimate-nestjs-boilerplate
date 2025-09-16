import { Environment } from '@/core//constants/app';
import { getConfig as getAppConfig } from '@/core/config/app/app.config';
import validateConfig from '@/core/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsBoolean, IsOptional } from 'class-validator';
import { GraphqlConfig } from './graphql-config.type';

class EnvironmentVariablesValidator {
  @IsBoolean()
  @IsOptional()
  GRAPHQL_INTROSPECTION: boolean;

  @IsBoolean()
  @IsOptional()
  GRAPHQL_LOCAL_LANDING_PAGE: boolean;
}

export function getConfig(): GraphqlConfig {
  const env = getAppConfig().nodeEnv;
  const isDevLike =
    env === Environment.Development ||
    env === Environment.Local ||
    env === Environment.Test;

  const introspectionEnv = process.env.GRAPHQL_INTROSPECTION;
  const localLandingEnv = process.env.GRAPHQL_LOCAL_LANDING_PAGE;

  return {
    introspection:
      introspectionEnv != null ? introspectionEnv === 'true' : true,
    localLandingPage:
      localLandingEnv != null ? localLandingEnv === 'true' : true,
  };
}

export default registerAs<GraphqlConfig>('graphql', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering GraphqlConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
