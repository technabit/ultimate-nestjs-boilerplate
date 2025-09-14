import { GlobalConfig } from '@/core/config/config.type';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
declare function useGraphqlExpressFactory(configService: ConfigService<GlobalConfig>): ApolloDriverConfig;
export default useGraphqlExpressFactory;
