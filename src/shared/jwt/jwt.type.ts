import { Role } from '@/api/user/user.enum';
import { JwtToken } from '@/constants/auth.constant';

export type RefreshTokenPayload = { sub: string; hash: string };
export type AccessTokenPayload = RefreshTokenPayload & { role: Role };
export type EmailVerificationTokenPayload = { sub: string };

export type JwtTokenPayload =
  | {
      type: `${JwtToken.AccessToken}`;
      payload: AccessTokenPayload;
    }
  | {
      type: `${JwtToken.RefreshToken}`;
      payload: RefreshTokenPayload;
    }
  | {
      type: `${JwtToken.EmailVerificationToken}`;
      payload: EmailVerificationTokenPayload;
    };
