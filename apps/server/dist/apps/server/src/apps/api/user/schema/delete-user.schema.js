"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserInput = void 0;
const tslib_1 = require("tslib");
const nest_core_1 = require("@app/nest-core");
const graphql_1 = require("@nestjs/graphql");
let DeleteUserInput = class DeleteUserInput {
    id;
};
exports.DeleteUserInput = DeleteUserInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    (0, nest_core_1.UUIDField)(),
    tslib_1.__metadata("design:type", String)
], DeleteUserInput.prototype, "id", void 0);
exports.DeleteUserInput = DeleteUserInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], DeleteUserInput);
//# sourceMappingURL=delete-user.schema.js.map