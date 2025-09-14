"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const auth_1 = require("../../../../../packages/core/src/constants/auth");
const node_1 = require("better-auth/node");
let AuthGuard = class AuthGuard {
    reflector;
    auth;
    constructor(reflector, auth) {
        this.reflector = reflector;
        this.auth = auth;
    }
    async canActivate(context) {
        const isAuthPublic = this.reflector.getAllAndOverride(auth_1.IS_PUBLIC_AUTH, [context.getHandler(), context.getClass()]);
        if (isAuthPublic)
            return true;
        const contextType = context.getType();
        if (contextType === 'ws') {
            const socket = context.switchToWs().getClient();
            try {
                const session = await this.auth.api.getSession({
                    headers: (0, node_1.fromNodeHeaders)(socket?.handshake?.headers),
                });
                socket['session'] = session;
            }
            catch (_) {
                socket.disconnect();
                return false;
            }
            return true;
        }
        let request;
        if (contextType === 'graphql') {
            const gqlCtx = graphql_1.GqlExecutionContext.create(context);
            request = gqlCtx.getContext()?.req;
        }
        else {
            request = context.switchToHttp().getRequest();
        }
        const session = await this.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(request?.headers),
        });
        request['session'] = session;
        request['user'] = session?.user ?? null;
        const isAuthOptional = this.reflector.getAllAndOverride(auth_1.IS_OPTIONAL_AUTH, [context.getHandler(), context.getClass()]);
        if (isAuthOptional && !session)
            return true;
        if (!session) {
            throw new common_1.UnauthorizedException({
                code: 'UNAUTHORIZED',
            });
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(core_1.Reflector)),
    tslib_1.__param(1, (0, common_1.Inject)(auth_1.AUTH_INSTANCE_KEY)),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector, Object])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map