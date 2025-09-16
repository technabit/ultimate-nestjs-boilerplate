import { type BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigType } from '@nestjs/config';
import bullConfig from './bull.config';

async function useBullFactory(
  config: ConfigType<typeof bullConfig>,
): Promise<BullRootModuleOptions> {
  return {
    prefix: config.prefix,
    defaultJobOptions: config.defaultJobOptions,
    connection: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      tls: config.redis.tls,
    },
  };
}

export default useBullFactory;
