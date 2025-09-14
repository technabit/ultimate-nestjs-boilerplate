"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberField = NumberField;
exports.NumberFieldOptional = NumberFieldOptional;
exports.StringField = StringField;
exports.TokenField = TokenField;
exports.StringFieldOptional = StringFieldOptional;
exports.PasswordField = PasswordField;
exports.PasswordFieldOptional = PasswordFieldOptional;
exports.BooleanField = BooleanField;
exports.BooleanFieldOptional = BooleanFieldOptional;
exports.EmailField = EmailField;
exports.EmailFieldOptional = EmailFieldOptional;
exports.UUIDField = UUIDField;
exports.UUIDFieldOptional = UUIDFieldOptional;
exports.URLField = URLField;
exports.URLFieldOptional = URLFieldOptional;
exports.DateField = DateField;
exports.DateFieldOptional = DateFieldOptional;
exports.EnumField = EnumField;
exports.EnumFieldOptional = EnumFieldOptional;
exports.ClassField = ClassField;
exports.ClassFieldOptional = ClassFieldOptional;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const transform_decorators_1 = require("./transform.decorators");
const is_nullable_decorator_1 = require("./validators/is-nullable.decorator");
const is_password_decorator_1 = require("./validators/is-password.decorator");
function NumberField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => Number)];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null, { each: options.each }));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: Number, ...options }));
    }
    if (options.int) {
        decorators.push((0, class_validator_1.IsInt)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.IsNumber)({}, { each: options.each }));
    }
    if (typeof options.min === 'number') {
        decorators.push((0, class_validator_1.Min)(options.min, { each: options.each }));
    }
    if (typeof options.max === 'number') {
        decorators.push((0, class_validator_1.Max)(options.max, { each: options.each }));
    }
    if (options.isPositive) {
        decorators.push((0, class_validator_1.IsPositive)({ each: options.each }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function NumberFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), NumberField({ required: false, ...options }));
}
function StringField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => String), (0, class_validator_1.IsString)({ each: options.each })];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null, { each: options.each }));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: String, ...options, isArray: options.each }));
    }
    const minLength = options.minLength ?? 1;
    decorators.push((0, class_validator_1.MinLength)(minLength, { each: options.each }));
    if (options.maxLength) {
        decorators.push((0, class_validator_1.MaxLength)(options.maxLength, { each: options.each }));
    }
    if (options.toLowerCase) {
        decorators.push((0, transform_decorators_1.ToLowerCase)());
    }
    if (options.toUpperCase) {
        decorators.push((0, transform_decorators_1.ToUpperCase)());
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function TokenField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => String), (0, class_validator_1.IsJWT)({ each: options.each })];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null, { each: options.each }));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: String, ...options, isArray: options.each }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function StringFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), StringField({ required: false, minLength: 0, ...options }));
}
function PasswordField(options = {}) {
    const decorators = [StringField({ ...options, minLength: 6 }), (0, is_password_decorator_1.IsPassword)()];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function PasswordFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), PasswordField({ required: false, ...options }));
}
function BooleanField(options = {}) {
    const decorators = [(0, transform_decorators_1.ToBoolean)(), (0, class_validator_1.IsBoolean)()];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: Boolean, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function BooleanFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), BooleanField({ required: false, ...options }));
}
function EmailField(options = {}) {
    const decorators = [
        (0, class_validator_1.IsEmail)(),
        StringField({ toLowerCase: true, ...options }),
        class_validator_1.IsNotEmpty,
    ];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: String, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function EmailFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), EmailField({ required: false, ...options }));
}
function UUIDField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => String), (0, class_validator_1.IsUUID)('4', { each: options.each })];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({
            type: options.each ? [String] : String,
            format: 'uuid',
            isArray: options.each,
            ...options,
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function UUIDFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), UUIDField({ required: false, ...options }));
}
function URLField(options = {}) {
    const decorators = [StringField(options), (0, class_validator_1.IsUrl)({}, { each: true })];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null, { each: options.each }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function URLFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), URLField({ required: false, ...options }));
}
function DateField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: Date, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function DateFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), DateField({ ...options, required: false }));
}
function EnumField(getEnum, options = {}) {
    const decorators = [(0, class_validator_1.IsEnum)(getEnum(), { each: options.each })];
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({
            type: 'enum',
            enum: getEnum(),
            isArray: options.each,
            ...options,
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function EnumFieldOptional(getEnum, options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), EnumField(getEnum, { required: false, ...options }));
}
function ClassField(getClass, options = {}) {
    const decorators = [
        (0, class_transformer_1.Type)(() => getClass()),
        (0, class_validator_1.ValidateNested)({ each: options.each }),
    ];
    if (options.required !== false) {
        decorators.push((0, class_validator_1.IsDefined)());
    }
    if (options.nullable) {
        decorators.push((0, is_nullable_decorator_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({
            type: () => getClass(),
            ...options,
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ClassFieldOptional(getClass, options = {}) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)({ each: options.each }), ClassField(getClass, { required: false, ...options }));
}
//# sourceMappingURL=field.decorators.js.map