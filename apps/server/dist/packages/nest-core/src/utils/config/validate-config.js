"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validateConfig(config, envVariablesClass) {
    const validatedConfig = (0, class_transformer_1.plainToClass)(envVariablesClass, config, {
        enableImplicitConversion: true,
    });
    const errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        const errorMsg = errors
            .map((error) => `\nError in ${error.property}:\n` +
            Object.entries(error.constraints)
                .map(([key, value]) => `+ ${key}: ${value}`)
                .join('\n'))
            .join('\n');
        console.error(`\n${errors.toString()}`);
        throw new Error(errorMsg);
    }
    return validatedConfig;
}
exports.default = validateConfig;
//# sourceMappingURL=validate-config.js.map