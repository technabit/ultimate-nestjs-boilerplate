import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  admin,
  bearer,
  genericOAuth,
  jwt,
  magicLink,
  multiSession,
  openAPI,
  organization,
  phoneNumber,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

const client = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: 'postgresql',
  }),
  appName: '@technabit/backend-api',
  plugins: [
    genericOAuth({
      config: [],
    }),
    admin(),
    jwt(),
    openAPI(),
    multiSession(),
    bearer(),
    organization(),
    passkey(),
    magicLink({
      sendMagicLink({ email, token, url }, request) {
        // Send email with magic link
      },
    }),
    phoneNumber(),
    username(),
  ],
});
