"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileDto = void 0;
const tslib_1 = require("tslib");
const field_decorators_1 = require("../../../../core/decorators/field.decorators");
const class_transformer_1 = require("class-transformer");
let UpdateUserProfileDto = class UpdateUserProfileDto {
    username;
    firstName;
    lastName;
    image;
};
exports.UpdateUserProfileDto = UpdateUserProfileDto;
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UpdateUserProfileDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UpdateUserProfileDto.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UpdateUserProfileDto.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], UpdateUserProfileDto.prototype, "image", void 0);
exports.UpdateUserProfileDto = UpdateUserProfileDto = tslib_1.__decorate([
    (0, class_transformer_1.Exclude)()
], UpdateUserProfileDto);
//# sourceMappingURL=update-user-profile.dto.js.map