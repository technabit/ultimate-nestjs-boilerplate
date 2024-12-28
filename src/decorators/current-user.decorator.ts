import { AccessTokenPayload } from '@/shared/jwt/jwt.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type FastifyRequest } from 'fastify';

export const CurrentUser = createParamDecorator(
  (data: keyof AccessTokenPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user: AccessTokenPayload = request['user']; // request['user'] is set in the AuthGuard
    return data ? user?.[data] : user;
  },
);
