import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Auth } from 'better-auth/auth';
export declare class AuthGuard implements CanActivate {
    private readonly reflector;
    private readonly auth;
    constructor(reflector: Reflector, auth: Auth);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
