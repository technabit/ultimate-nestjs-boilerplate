"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorPaginatedUserDto = exports.QueryUsersCursorDto = exports.OffsetPaginatedUserDto = exports.QueryUsersOffsetDto = exports.UserDto = void 0;
const tslib_1 = require("tslib");
const cursor_pagination_dto_1 = require("../../../../core/common/dto/cursor-pagination/cursor-pagination.dto");
const page_options_dto_1 = require("../../../../core/common/dto/cursor-pagination/page-options.dto");
const paginated_dto_1 = require("../../../../core/common/dto/cursor-pagination/paginated.dto");
const offset_pagination_dto_1 = require("../../../../core/common/dto/offset-pagination/offset-pagination.dto");
const page_options_dto_2 = require("../../../../core/common/dto/offset-pagination/page-options.dto");
const paginated_dto_2 = require("../../../../core/common/dto/offset-pagination/paginated.dto");
const field_decorators_1 = require("../../../../core/decorators/field.decorators");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_enum_1 = require("../user.enum");
let UserDto = class UserDto {
    id;
    role;
    username;
    email;
    firstName;
    lastName;
    image;
    createdAt;
    updatedAt;
    bio;
};
exports.UserDto = UserDto;
tslib_1.__decorate([
    (0, field_decorators_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.EnumField)(() => user_enum_1.Role),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "role", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "image", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.ClassField)(() => Date),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Date)
], UserDto.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.ClassField)(() => Date),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Date)
], UserDto.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, field_decorators_1.StringFieldOptional)(),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "bio", void 0);
exports.UserDto = UserDto = tslib_1.__decorate([
    (0, class_transformer_1.Exclude)()
], UserDto);
class QueryUsersOffsetDto extends page_options_dto_2.PageOptionsDto {
}
exports.QueryUsersOffsetDto = QueryUsersOffsetDto;
class OffsetPaginatedUserDto extends paginated_dto_2.OffsetPaginatedDto {
}
exports.OffsetPaginatedUserDto = OffsetPaginatedUserDto;
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: UserDto, isArray: true }),
    (0, class_transformer_1.Type)(() => UserDto),
    tslib_1.__metadata("design:type", Array)
], OffsetPaginatedUserDto.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: offset_pagination_dto_1.OffsetPaginationDto }),
    (0, class_transformer_1.Type)(() => offset_pagination_dto_1.OffsetPaginationDto),
    tslib_1.__metadata("design:type", offset_pagination_dto_1.OffsetPaginationDto)
], OffsetPaginatedUserDto.prototype, "pagination", void 0);
class QueryUsersCursorDto extends page_options_dto_1.PageOptionsDto {
}
exports.QueryUsersCursorDto = QueryUsersCursorDto;
class CursorPaginatedUserDto extends paginated_dto_1.CursorPaginatedDto {
}
exports.CursorPaginatedUserDto = CursorPaginatedUserDto;
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: UserDto, isArray: true }),
    (0, class_transformer_1.Type)(() => UserDto),
    tslib_1.__metadata("design:type", Array)
], CursorPaginatedUserDto.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: cursor_pagination_dto_1.CursorPaginationDto }),
    (0, class_transformer_1.Type)(() => cursor_pagination_dto_1.CursorPaginationDto),
    tslib_1.__metadata("design:type", cursor_pagination_dto_1.CursorPaginationDto)
], CursorPaginatedUserDto.prototype, "pagination", void 0);
//# sourceMappingURL=user.dto.js.map