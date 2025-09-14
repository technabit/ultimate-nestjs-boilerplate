"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBothOrNonePresent = IsBothOrNonePresent;
const class_validator_1 = require("class-validator");
function IsBothOrNonePresent(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsBothOrNonePresent',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return (value && relatedValue) || (!value && !relatedValue);
                },
                defaultMessage(args) {
                    return `$property and ${args.constraints[0]} must be both provided or omitted`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-both-or-none-present.decorator.js.map