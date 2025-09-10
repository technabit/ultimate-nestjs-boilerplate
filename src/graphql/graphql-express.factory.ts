import { ApiModule } from '@/api/api.module';
import { GlobalConfig } from '@/config/config.type';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';

function useGraphqlExpressFactory(
  configService: ConfigService<GlobalConfig>,
): ApolloDriverConfig {
  const env = configService.get('app.nodeEnv', { infer: true });
  const isDevLike = env === 'development' || env === 'local' || env === 'test';
  return {
    playground: false,
    introspection: isDevLike,
    plugins: isDevLike
      ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
      : [ApolloServerPluginLandingPageProductionDefault()],
    autoSchemaFile: path.join(
      __dirname,
      '../../src/generated/schema.generated.gql',
    ),
    formatError: (...params: Parameters<ApolloDriverConfig['formatError']>) => {
      const [err] = params;
      if (!isDevLike) {
        if ('stacktrace' in err.extensions) {
          err.extensions.stacktrace = null;
        }
      }
      return err;
    },
    include: [ApiModule],
    context: ({ req, res }: { req: FastifyRequest; res: FastifyReply }) => ({
      req,
      res,
    }),
  };
}

export default useGraphqlExpressFactory;
