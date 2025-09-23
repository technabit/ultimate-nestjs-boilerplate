import { UserSession as UserSessionType } from '@/core/auth/auth.type';
import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { type FastifyRequest } from 'fastify';

export type CurrentUserSession = UserSessionType & {
  headers: FastifyRequest['headers'];
};

export const CurrentUserSession = createParamDecorator(
  (
    data: keyof UserSessionType | 'headers',
    ctx: ExecutionContext,
  ): CurrentUserSession => {
    const contextType: ContextType & 'graphql' = ctx.getType();

    let request: FastifyRequest & Partial<UserSessionType> & { user?: any };

    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(ctx);
      request = gqlCtx.getContext()?.req;
    } else {
      request = ctx.switchToHttp().getRequest();
    }

    if (data == null) {
      const session = (request as any)?.session;
      const user = (request as any)?.user;
      return {
        session,
        user,
        headers: request?.headers,
      } as unknown as CurrentUserSession;
    }

    if (data === 'headers') {
      return request.headers as unknown as CurrentUserSession;
    }

    return (request as any)?.session?.[data] as unknown as CurrentUserSession;
  },
);
