"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateDto = ValidateDto;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function ValidateDto(dtoClass, options) {
    return function (target, key, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const argIndex = options?.argIndex ?? 0;
            const arg = args[argIndex];
            if (arg == null || typeof arg !== 'object') {
                throw new Error(`Argument supplied at index ${argIndex} is invalid.`);
            }
            const dtoObject = (0, class_transformer_1.plainToInstance)(dtoClass, arg);
            const errors = await (0, class_validator_1.validate)(options?.property ? dtoObject?.[options?.property] : dtoObject);
            if (errors.length > 0) {
                throw new common_1.BadRequestException(errors.map((error) => Object.values(error.constraints)).join(', '));
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
//# sourceMappingURL=validate-dto.decorator.js.map