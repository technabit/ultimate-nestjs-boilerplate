import { AuthService } from '@/core/auth/auth.service';
import { GlobalConfig } from '@/core/config/config.type';
import { CacheService } from '@/core/shared/cache/cache.service';
import { validateUsername } from '@/core/utils/validators/username';
import { ConfigService } from '@nestjs/config';
import { APIError } from 'better-auth/api';
import { magicLink, openAPI, phoneNumber, twoFactor, username } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { BetterAuthOptions, BetterAuthPlugin } from 'better-auth';
import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

/**
 * Better Auth Configuration
 * Visit https://www.better-auth.com/docs/reference/options to see full options
 * Visit `/api/auth/reference` to see all the API references integrated in this better auth instance
 */
export function getConfig({
  configService,
  cacheService,
  authService,
}: {
  configService: ConfigService<GlobalConfig>;
  cacheService: CacheService;
  authService: AuthService;
}): BetterAuthOptions {
  const appConfig = configService.getOrThrow('app', { infer: true });
  const databaseConfig = configService.getOrThrow('database', { infer: true });
  const authConfig = configService.getOrThrow('auth', { infer: true });

  // Core plugins
  const plugins: BetterAuthPlugin[] = [
    (username({
      usernameValidator: validateUsername,
      minUsernameLength: 5,
      maxUsernameLength: 15
    }) as unknown as BetterAuthPlugin),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, request) => {
          // Implement sending OTP code via SMS
      }
    }),
    magicLink({
      disableSignUp: true,
      async sendMagicLink({ email, url }) {
        try {
          await authService.sendSigninMagicLink({ email, url });
        } catch (error: any) {
          throw new APIError(error.status, {
            status: error.status,
            message: error.message,
          });
        }
      },
    }),
    twoFactor(),
    passkey({
      rpName: appConfig.name,
    }),
  ];

  // Plugins for development only
  const nonProdPlugins = [openAPI()];
  if (appConfig.nodeEnv !== 'production') {
    plugins.push(...nonProdPlugins);
  }

  return {
    appName: appConfig.name,
    secret: authConfig.authSecret,
    baseURL: appConfig.url,
    trustedOrigins: authConfig.trustedOrigins,
    plugins,
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
      sendResetPassword: async ({ url, user }) => {
        try {
          await authService.resetPassword({ url, userId: user.id });
        } catch (error: any) {
          throw new APIError(error.status, {
            status: error.status,
            message: error.message,
          });
        }
      },
    },
    session: {
      freshAge: 0, // We perform every sensitive operation via our own API so this is irrelevant.
      modelName: 'session',
      cookieCache: {
        enabled: false,
        maxAge: 3600,
      }
    },
    user: {
      modelName: 'user',
      additionalFields: {
        externalId: {
          type: "string",
          unique: true,
          required: false,
        }
      },
    },
    account: {
      modelName: 'account',
      encryptOAuthTokens: true,
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "email-password"],
        allowDifferentEmails: false,
      }
    },
    verification: {
      modelName: 'verification',
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        try {
          await authService.verifyEmail({ url, userId: user.id });
        } catch (error: any) {
          throw new APIError(error.status, {
            status: error.status,
            message: error.message,
          });
        }
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 3600 // 1 hour
    },
    socialProviders: {
      ...(authConfig.oAuth.github?.clientId &&
      authConfig.oAuth.github?.clientSecret
        ? {
            github: {
              clientId: authConfig.oAuth.github?.clientId,
              clientSecret: authConfig.oAuth.github?.clientSecret,
              mapProfileToUser(profile) {
                return {
                  email: profile.email,
                  name: profile.login,
                  username: profile.login,
                  emailVerified: true,
                  image: profile.avatar_url,
                };
              },
            },
          }
        : {}),
    },
    rateLimit: {
      enabled: true,
      window: 10,
      max: 100,
      customRules: {
        "/example/path": {
          window: 10,
          max: 100
        }
      },
      storage: "memory",
      modelName: "rateLimit"
    },
    advanced: {
      ipAddress: {
        ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
        disableIpTracking: false
      },
      cookiePrefix: authConfig.cookiePrefix,
      database: {
        generateId() {
          return uuid();
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
                ttl: ttl * 1000,
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
