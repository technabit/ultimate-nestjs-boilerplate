"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const validate_config_1 = tslib_1.__importDefault(require("./validate-config"));
const class_validator_1 = require("class-validator");
require("reflect-metadata");
class EnvVariables {
    DATABASE_HOST;
    DATABASE_PORT;
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], EnvVariables.prototype, "DATABASE_HOST", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], EnvVariables.prototype, "DATABASE_PORT", void 0);
describe('validateConfig', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation();
    });
    it('should return validated config for valid input', () => {
        const config = {
            DATABASE_HOST: 'localhost',
            DATABASE_PORT: 5432,
        };
        const result = (0, validate_config_1.default)(config, EnvVariables);
        expect(result).toEqual({
            DATABASE_HOST: 'localhost',
            DATABASE_PORT: 5432,
        });
    });
    it('should throw an error for missing properties', () => {
        const config = {
            DATABASE_HOST: 'localhost',
        };
        expect(() => (0, validate_config_1.default)(config, EnvVariables)).toThrow(/Error in DATABASE_PORT:/);
    });
    it('should throw an error for incorrect types', () => {
        const config = {
            DATABASE_HOST: 'localhost',
            DATABASE_PORT: 'not-a-number',
        };
        expect(() => (0, validate_config_1.default)(config, EnvVariables)).toThrow(/Error in DATABASE_PORT:/);
    });
});
//# sourceMappingURL=validate-config.spec.js.map