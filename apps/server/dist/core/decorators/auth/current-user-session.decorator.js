"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUserSession = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
exports.CurrentUserSession = (0, common_1.createParamDecorator)((data, ctx) => {
    const contextType = ctx.getType();
    let request;
    if (contextType === 'graphql') {
        const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
        request = gqlCtx.getContext()?.req;
    }
    else {
        request = ctx.switchToHttp().getRequest();
    }
    return data == null
        ? {
            ...request?.session,
            headers: request?.headers,
        }
        : request.session?.[data];
});
//# sourceMappingURL=current-user-session.decorator.js.map