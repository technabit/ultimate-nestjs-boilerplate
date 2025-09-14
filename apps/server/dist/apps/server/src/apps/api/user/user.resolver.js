"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const nest_core_1 = require("@app/nest-core");
const graphql_1 = require("@nestjs/graphql");
const nestjs_i18n_2 = require("nestjs-i18n");
const delete_user_schema_1 = require("./schema/delete-user.schema");
const get_user_schema_1 = require("./schema/get-user.schema");
const user_schema_1 = require("./schema/user.schema");
const user_service_1 = require("./user.service");
let UserResolver = class UserResolver {
    userService;
    i18nService;
    logger = new common_1.Logger(this.constructor.name);
    constructor(userService, i18nService) {
        this.userService = userService;
        this.i18nService = i18nService;
    }
    async whoami(user) {
        return this.userService.findOneUser(user.id);
    }
    async getUsers() {
        return this.userService.getAllUsers();
    }
    async getUser({ id }) {
        return this.userService.findOneUser(id);
    }
    async deleteUser(userInput) {
        return this.userService.deleteUser(userInput.id);
    }
    async self(user) {
        return this.userService.findOneUser(user.id);
    }
    async foo(userSession, i18n) {
        this.logger.log('User Session', userSession);
        return i18n.t('user.sayFoo');
    }
};
exports.UserResolver = UserResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => user_schema_1.UserSchema),
    tslib_1.__param(0, (0, nest_core_1.CurrentUserSession)('user')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "whoami", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [user_schema_1.UserSchema]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => user_schema_1.UserSchema),
    tslib_1.__param(0, (0, graphql_1.Args)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [get_user_schema_1.GetUserArgs]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => user_schema_1.UserSchema),
    tslib_1.__param(0, (0, graphql_1.Args)('input')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [delete_user_schema_1.DeleteUserInput]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
tslib_1.__decorate([
    (0, graphql_1.ResolveField)(() => user_schema_1.UserSchema),
    tslib_1.__param(0, (0, graphql_1.Parent)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_schema_1.UserSchema]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "self", null);
tslib_1.__decorate([
    (0, graphql_1.ResolveField)(() => String),
    tslib_1.__param(0, (0, nest_core_1.CurrentUserSession)()),
    tslib_1.__param(1, (0, nestjs_i18n_1.I18n)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, nestjs_i18n_1.I18nContext]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "foo", null);
exports.UserResolver = UserResolver = tslib_1.__decorate([
    (0, common_1.UseGuards)(nest_core_1.AuthGuard),
    (0, graphql_1.Resolver)(() => user_schema_1.UserSchema),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService,
        nestjs_i18n_2.I18nService])
], UserResolver);
//# sourceMappingURL=user.resolver.js.map