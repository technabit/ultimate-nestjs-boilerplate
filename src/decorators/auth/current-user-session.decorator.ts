import { UserSession as UserSessionType } from '@/auth/types';
import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { type FastifyRequest } from 'fastify';

export const CurrentUserSession = createParamDecorator(
  (data: keyof UserSessionType, ctx: ExecutionContext): UserSessionType => {
    const contextType: ContextType & 'graphql' = ctx.getType();

    let request: FastifyRequest & UserSessionType;

    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(ctx);
      request = gqlCtx.getContext()?.req;
    } else {
      request = ctx.switchToHttp().getRequest();
    }

    return data == null ? request.session : request.session[data];
  },
);
