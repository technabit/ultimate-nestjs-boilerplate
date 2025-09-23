import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  magicLink,
  openAPI,
  phoneNumber,
  twoFactor,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { v4 as uuid } from 'uuid';

const client = new PrismaClient();

type AuthInstance = ReturnType<typeof betterAuth>;

const appName = process.env.APP_NAME ?? '@technabit/backend-api';
const baseURL = process.env.APP_BASE_URL ?? 'http://localhost:3000';
const authSecret = process.env.AUTH_SECRET ?? 'dev-secret';
const isProd = process.env.NODE_ENV === 'production';

const plugins = [
  username({
    minUsernameLength: 5,
    maxUsernameLength: 15,
  }),
  phoneNumber({
    sendOTP: ({ phoneNumber, code }, request) => {
      // Implement sending OTP code via SMS
    },
  }),
  magicLink({
    disableSignUp: true,
    async sendMagicLink({ email, url }) {
      // Wire your email sender here if desired; not needed for schema generation
    },
  }),
  twoFactor(),
  passkey({
    rpName: appName,
  }),
  // openAPI only in non-production to match real config behavior
  ...(isProd ? [] : [openAPI()]),
];

export const auth: AuthInstance = betterAuth({
  appName,
  secret: authSecret,
  baseURL,
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    '*.dev.local',
  ],
  plugins,
  database: prismaAdapter(client, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    async sendResetPassword({ url }) {
      // Integrate your reset password email here if needed for runtime
    },
  },
  session: {
    freshAge: 0,
    modelName: 'session',
  },
  user: {
    modelName: 'user',
    additionalFields: {
      externalId: {
        type: 'string',
        unique: true,
        required: false,
      },
      deletedAt: {
        type: 'date',
        required: false,
      },
    },
  },
  account: {
    modelName: 'account',
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'email-password'],
      allowDifferentEmails: false,
    },
  },
  verification: {
    modelName: 'verification',
  },
  emailVerification: {
    async sendVerificationEmail({ url }) {
      // Integrate your verification email here if needed for runtime
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    customRules: {
      '/example/path': {
        window: 10,
        max: 100,
      },
    },
    storage: 'memory',
    modelName: 'rateLimit',
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-client-ip', 'x-forwarded-for'],
      disableIpTracking: false,
    },
    cookiePrefix: 'r5FrNpVFQr4vt2kKD6f4yaUJ',
    database: {
      useNumberId: false,
      generateId() {
        return uuid();
      },
    },
  },
});
