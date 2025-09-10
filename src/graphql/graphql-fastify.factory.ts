import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import type { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';

/** Narrow type for anything Apollo/Nest might pass to `context` */
type AnyCtx =
  | FastifyRequest
  | { request?: FastifyRequest; reply?: FastifyReply }
  | { req?: any; res?: any }
  | Record<string, unknown>;

/** Heuristic: is this object a FastifyRequest? */
function isFastifyRequest(x: any): x is FastifyRequest {
  return (
    !!x &&
    typeof x === 'object' &&
    'headers' in x &&
    ('id' in x || 'raw' in x || 'log' in x)
  );
}

/** Ensure `req.header(name)` exists and reads from lowercase headers */
function ensureReqHeaderFn<
  T extends { headers?: Record<string, any> } & Record<string, any>,
>(req: T): T {
  if (req && typeof req.header !== 'function') {
    Object.defineProperty(req, 'header', {
      value: (name: string) => req.headers?.[String(name).toLowerCase()],
      enumerable: false,
    });
  }
  return req;
}

/** Ensure `res.header(name, value)` exists (Fastify reply or Node res) */
function ensureResHeaderFn<R extends Record<string, any>>(res: R): R {
  if (res && typeof res.header !== 'function') {
    if (typeof res.setHeader === 'function') {
      // Node.js ServerResponse
      Object.defineProperty(res, 'header', {
        value: (name: string, value: any) => {
          res.setHeader(name, value);
          return res;
        },
        enumerable: false,
      });
    } else if (typeof res.raw?.setHeader === 'function') {
      // Some Fastify replies expose raw res
      Object.defineProperty(res, 'header', {
        value: (name: string, value: any) => {
          res.raw.setHeader(name, value);
          return res;
        },
        enumerable: false,
      });
    } else {
      // Last resort: no-op – keeps guards/middleware from crashing
      Object.defineProperty(res, 'header', {
        value: () => res,
        enumerable: false,
      });
    }
  }
  return res;
}

/** Normalize whatever comes from Nest/Apollo into { req, res, request, reply } */
function normalizeGraphQLContext(ctx: AnyCtx) {
  const request: FastifyRequest | undefined = isFastifyRequest(ctx)
    ? ctx
    : ((ctx as any)?.request ?? (ctx as any)?.req);

  const reply: FastifyReply | any =
    (ctx as any)?.reply ??
    (ctx as any)?.res ??
    (request as any)?.reply ??
    (request as any)?.raw?.res ??
    undefined;

  const req = ensureReqHeaderFn((request ?? {}) as any);
  const res = ensureResHeaderFn((reply ?? {}) as any);

  return {
    // Fastify-style for anyone who needs it:
    request: request as FastifyRequest | undefined,
    reply: reply as FastifyReply | undefined,
    // Normalized names many Nest libs expect:
    req,
    res,
  };
}

/** Your clean Apollo config factory */
export default function useGraphqlFastifyFactory(
  nodeEnv = process.env.NODE_ENV,
): ApolloDriverConfig {
  const isDevLike =
    nodeEnv === 'development' || nodeEnv === 'local' || nodeEnv === 'test';

  return {
    // driver is provided where you call GraphQLModule.forRoot
    playground: false,
    introspection: isDevLike,
    plugins: isDevLike
      ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
      : [ApolloServerPluginLandingPageProductionDefault()],
    autoSchemaFile: path.join(
      __dirname,
      '../../src/generated/schema.generated.gql',
    ),

    // <- the only interesting bit:
    context: (ctx: AnyCtx) => normalizeGraphQLContext(ctx),
  };
}
