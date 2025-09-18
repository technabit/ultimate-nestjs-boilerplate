import { createAuthClient } from 'better-auth/client';
import {
  adminClient,
  genericOAuthClient,
  inferAdditionalFields,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  passkeyClient,
  phoneNumberClient,
  usernameClient,
} from 'better-auth/client/plugins';
import type { auth } from './auth.ts';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    phoneNumberClient(),
    magicLinkClient(),
    passkeyClient(),
    organizationClient(),
    multiSessionClient(),
    adminClient(),
    genericOAuthClient(),
  ],
});
