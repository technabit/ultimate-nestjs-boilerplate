"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNullable = IsNullable;
const class_validator_1 = require("class-validator");
function IsNullable(options) {
    return (0, class_validator_1.ValidateIf)((_obj, value) => value !== null, options);
}
//# sourceMappingURL=is-nullable.decorator.js.map