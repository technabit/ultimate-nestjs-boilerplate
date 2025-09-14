"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const auth_guard_1 = require("@app/nest-core/auth/auth.guard");
const current_user_session_decorator_1 = require("@app/nest-core/decorators/auth/current-user-session.decorator");
const http_decorators_1 = require("@app/nest-core/decorators/http.decorators");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_user_profile_dto_1 = require("./dto/update-user-profile.dto");
const user_dto_1 = require("./dto/user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getCurrentUser(user) {
        return await this.userService.findOneUser(user.id);
    }
    async findAllUsers(dto) {
        return await this.userService.findAllUsers(dto);
    }
    async findAllUsersCursor(dto) {
        return await this.userService.findAllUsersCursor(dto);
    }
    async findUser(id) {
        return await this.userService.findOneUser(id);
    }
    deleteUser(id) {
        return this.userService.deleteUser(id);
    }
    updateUserProfile(dto, userSession) {
        return this.userService.updateUserProfile(userSession.user.id, dto, {
            headers: userSession.headers,
        });
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, http_decorators_1.ApiAuth)({
        summary: 'Get current user',
        type: user_dto_1.UserDto,
    }),
    (0, common_1.Get)('whoami'),
    tslib_1.__param(0, (0, current_user_session_decorator_1.CurrentUserSession)('user')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getCurrentUser", null);
tslib_1.__decorate([
    (0, common_1.Get)('/all'),
    (0, http_decorators_1.ApiAuth)({
        type: user_dto_1.OffsetPaginatedUserDto,
        summary: 'List users.',
        isPaginated: true,
    }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_dto_1.QueryUsersOffsetDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsers", null);
tslib_1.__decorate([
    (0, common_1.Get)('/all/cursor'),
    (0, http_decorators_1.ApiAuth)({
        type: user_dto_1.CursorPaginatedUserDto,
        summary: 'List users via cursor.',
        isPaginated: true,
        paginationType: 'cursor',
    }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_dto_1.QueryUsersCursorDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsersCursor", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, http_decorators_1.ApiAuth)({ summary: 'Find user by id', type: user_dto_1.UserDto }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findUser", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, http_decorators_1.ApiAuth)({
        summary: 'Delete a user',
        errorResponses: [400, 401, 403, 404, 500],
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'String' }),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
tslib_1.__decorate([
    (0, http_decorators_1.ApiAuth)({
        summary: "Update user's profile",
        type: user_dto_1.UserDto,
    }),
    (0, common_1.Patch)('profile'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, current_user_session_decorator_1.CurrentUserSession)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_user_profile_dto_1.UpdateUserProfileDto, typeof (_a = typeof current_user_session_decorator_1.CurrentUserSession !== "undefined" && current_user_session_decorator_1.CurrentUserSession) === "function" ? _a : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "updateUserProfile", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('user'),
    (0, common_1.Controller)({
        path: 'user',
        version: '1',
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map