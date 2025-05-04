import { GlobalConfig } from '@/config/config.type';
import { Job } from '@/constants/job.constant';
import { CacheService } from '@/shared/cache/cache.service';
import { VerifyEmailJob } from '@/worker/queues/email/email.type';
import { ConfigService } from '@nestjs/config';
import { username as usernamePlugin } from 'better-auth/plugins';
import { BetterAuthOptions } from 'better-auth/types';
import { Queue as BullMqQueue } from 'bullmq';
import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

/**
 * Better auth configuration
 * Visit https://www.better-auth.com/docs/reference/options to see full options
 */
export function getConfig({
  configService,
  cacheService,
  emailQueue,
}: {
  configService: ConfigService<GlobalConfig>;
  cacheService: CacheService;
  emailQueue: BullMqQueue<VerifyEmailJob, any, string>;
}): BetterAuthOptions {
  const appConfig = configService.getOrThrow('app', { infer: true });
  const databaseConfig = configService.getOrThrow('database', { infer: true });
  const authConfig = configService.getOrThrow('auth', { infer: true });

  return {
    appName: appConfig.name,
    secret: authConfig.authSecret,
    baseURL: appConfig.url,
    plugins: [usernamePlugin()],
    database: new Pool({
      database: databaseConfig.database,
      user: databaseConfig.username,
      password: databaseConfig.password,
      host: databaseConfig.host,
      port: databaseConfig.port,
      ...(typeof databaseConfig.ssl === 'object'
        ? {
            ssl: {
              rejectUnauthorized: databaseConfig.ssl?.rejectUnauthorized,
              ca: databaseConfig.ssl?.ca,
              key: databaseConfig.ssl?.key,
              cert: databaseConfig.ssl?.cert,
            },
          }
        : {}),
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
    },
    session: {
      freshAge: 10,
      modelName: 'session',
    },
    user: {
      modelName: 'user',
      fields: {
        name: 'username',
        emailVerified: 'isEmailVerified',
      },
    },
    account: {
      modelName: 'account',
    },
    verification: {
      modelName: 'verification',
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await emailQueue.add(Job.EmailVerification, { url, userId: user.id });
      },
    },
    trustedOrigins: appConfig.corsOrigin as string[],
    advanced: {
      database: {
        generateId() {
          return uuid();
        },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if ('displayUsername' in user) {
              delete user.displayUsername;
            }
            return { data: user };
          },
        },
      },
    },
    // Use Redis for storing sessions
    secondaryStorage: {
      get: async (key) => {
        return (
          (await cacheService.get({ key: 'AccessToken', args: [key] })) ?? null
        );
      },
      set: async (key, value, ttl) => {
        await cacheService.set(
          { key: 'AccessToken', args: [key] },
          value,
          ttl
            ? {
                ttl: ttl,
              }
            : {},
        );
      },
      delete: async (key) => {
        await cacheService.delete({ key: 'AccessToken', args: [key] });
      },
    },
  };
}
