"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPassword = IsPassword;
const class_validator_1 = require("class-validator");
function IsPassword(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            propertyName: propertyName,
            name: 'isPassword',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value) {
                    return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
                },
                defaultMessage() {
                    return `$property is invalid`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-password.decorator.js.map