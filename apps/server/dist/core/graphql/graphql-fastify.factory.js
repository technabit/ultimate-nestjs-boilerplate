"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useGraphqlFastifyFactory;
const tslib_1 = require("tslib");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const path_1 = tslib_1.__importDefault(require("path"));
function isFastifyRequest(x) {
    return (!!x &&
        typeof x === 'object' &&
        'headers' in x &&
        ('id' in x || 'raw' in x || 'log' in x));
}
function ensureReqHeaderFn(req) {
    if (req && typeof req.header !== 'function') {
        Object.defineProperty(req, 'header', {
            value: (name) => req.headers?.[String(name).toLowerCase()],
            enumerable: false,
        });
    }
    return req;
}
function ensureResHeaderFn(res) {
    if (res && typeof res.header !== 'function') {
        if (typeof res.setHeader === 'function') {
            Object.defineProperty(res, 'header', {
                value: (name, value) => {
                    res.setHeader(name, value);
                    return res;
                },
                enumerable: false,
            });
        }
        else if (typeof res.raw?.setHeader === 'function') {
            Object.defineProperty(res, 'header', {
                value: (name, value) => {
                    res.raw.setHeader(name, value);
                    return res;
                },
                enumerable: false,
            });
        }
        else {
            Object.defineProperty(res, 'header', {
                value: () => res,
                enumerable: false,
            });
        }
    }
    return res;
}
function normalizeGraphQLContext(ctx) {
    const request = isFastifyRequest(ctx)
        ? ctx
        : (ctx?.request ?? ctx?.req);
    const reply = ctx?.reply ??
        ctx?.res ??
        request?.reply ??
        request?.raw?.res ??
        undefined;
    const req = ensureReqHeaderFn((request ?? {}));
    const res = ensureResHeaderFn((reply ?? {}));
    return {
        request: request,
        reply: reply,
        req,
        res,
    };
}
function useGraphqlFastifyFactory(nodeEnv = process.env.NODE_ENV) {
    const isDevLike = nodeEnv === 'development' || nodeEnv === 'local' || nodeEnv === 'test';
    return {
        playground: false,
        introspection: isDevLike,
        plugins: isDevLike
            ? [(0, default_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true })]
            : [(0, default_1.ApolloServerPluginLandingPageProductionDefault)()],
        autoSchemaFile: path_1.default.join(__dirname, '..', '..', 'generated', 'schema.generated.gql'),
        context: (ctx) => normalizeGraphQLContext(ctx),
    };
}
//# sourceMappingURL=graphql-fastify.factory.js.map