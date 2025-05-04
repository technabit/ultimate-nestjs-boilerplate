import { AUTH_INSTANCE_KEY } from '@/constants/auth.constant';
import { Inject, Injectable } from '@nestjs/common';
import type { Auth } from 'better-auth/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_INSTANCE_KEY)
    private readonly auth: Auth,
  ) {}

  get api() {
    return this.auth.api;
  }
}
