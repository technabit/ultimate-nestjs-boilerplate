import { getConfig as getAppConfig } from '@/config/app.config';
import { getConfig as getDatabaseConfig } from '@/database/config/database.config';
import { username as usernamePlugin } from 'better-auth/plugins';
import { BetterAuthOptions } from 'better-auth/types';
import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

export function getConfig(): BetterAuthOptions {
  const appConfig = getAppConfig();
  const databaseConfig = getDatabaseConfig();

  return {
    baseURL: appConfig.url,
    plugins: [usernamePlugin()],
    trustedOrigins: appConfig.corsOrigin as string[],
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
    advanced: {
      useSecureCookies: true,
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
  };
}
