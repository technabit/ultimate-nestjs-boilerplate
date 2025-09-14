"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserArgs = void 0;
const tslib_1 = require("tslib");
const field_decorators_1 = require("../../../../core/decorators/field.decorators");
const graphql_1 = require("@nestjs/graphql");
let GetUserArgs = class GetUserArgs {
    id;
};
exports.GetUserArgs = GetUserArgs;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, field_decorators_1.UUIDField)(),
    tslib_1.__metadata("design:type", String)
], GetUserArgs.prototype, "id", void 0);
exports.GetUserArgs = GetUserArgs = tslib_1.__decorate([
    (0, graphql_1.ArgsType)()
], GetUserArgs);
//# sourceMappingURL=get-user.schema.js.map