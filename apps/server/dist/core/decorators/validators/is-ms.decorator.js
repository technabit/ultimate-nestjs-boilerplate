"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsMs = IsMs;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const ms_1 = tslib_1.__importDefault(require("ms"));
function IsMs(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            propertyName: propertyName,
            name: 'isMs',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value) {
                    return (typeof value === 'string' &&
                        value.length != 0 &&
                        (0, ms_1.default)(value) !== undefined);
                },
                defaultMessage() {
                    return `$property must be a valid ms format`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-ms.decorator.js.map