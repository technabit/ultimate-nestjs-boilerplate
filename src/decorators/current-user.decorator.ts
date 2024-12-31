import { AccessTokenPayload } from '@/shared/jwt/jwt.type';
import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { type FastifyRequest } from 'fastify';

export const CurrentUser = createParamDecorator(
  (data: keyof AccessTokenPayload, ctx: ExecutionContext) => {
    const contextType: ContextType & 'graphql' = ctx.getType();

    let request: FastifyRequest;

    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(ctx);
      request = gqlCtx.getContext()?.req;
    } else {
      request = ctx.switchToHttp().getRequest();
    }

    const user: AccessTokenPayload = request['user']; // request['user'] is set in the AuthGuard
    return data ? user?.[data] : user;
  },
);
