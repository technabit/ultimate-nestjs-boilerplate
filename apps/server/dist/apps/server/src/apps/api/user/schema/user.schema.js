"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
let UserSchema = class UserSchema {
    id;
    email;
    username;
    bio;
    self;
};
exports.UserSchema = UserSchema;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", String)
], UserSchema.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], UserSchema.prototype, "username", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], UserSchema.prototype, "bio", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => UserSchema),
    tslib_1.__metadata("design:type", UserSchema)
], UserSchema.prototype, "self", void 0);
exports.UserSchema = UserSchema = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], UserSchema);
//# sourceMappingURL=user.schema.js.map