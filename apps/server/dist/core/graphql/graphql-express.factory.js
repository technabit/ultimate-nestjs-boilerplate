"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const api_module_1 = require("../../apps/api/api.module");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const path_1 = tslib_1.__importDefault(require("path"));
function useGraphqlExpressFactory(configService) {
    const env = configService.get('app.nodeEnv', { infer: true });
    const isDevLike = env === 'development' || env === 'local' || env === 'test';
    return {
        playground: false,
        introspection: isDevLike,
        plugins: isDevLike
            ? [(0, default_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true })]
            : [(0, default_1.ApolloServerPluginLandingPageProductionDefault)()],
        autoSchemaFile: path_1.default.join(__dirname, '..', '..', 'generated', 'schema.generated.gql'),
        formatError: (...params) => {
            const [err] = params;
            if (!isDevLike) {
                if ('stacktrace' in err.extensions) {
                    err.extensions.stacktrace = null;
                }
            }
            return err;
        },
        include: [api_module_1.ApiModule],
        context: ({ req, res }) => ({
            req,
            res,
        }),
    };
}
exports.default = useGraphqlExpressFactory;
//# sourceMappingURL=graphql-express.factory.js.map