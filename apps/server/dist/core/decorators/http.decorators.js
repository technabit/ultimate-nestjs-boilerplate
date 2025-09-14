"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAuth = exports.ApiPublic = void 0;
const error_dto_1 = require("../common/dto/error.dto");
const serialize_1 = require("../utils/interceptors/serialize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_1 = require("http");
const public_decorator_1 = require("./public.decorator");
const swagger_decorators_1 = require("./swagger.decorators");
const ApiPublic = (options = {}) => {
    const defaultStatusCode = common_1.HttpStatus.OK;
    const defaultErrorResponses = [
        common_1.HttpStatus.BAD_REQUEST,
        common_1.HttpStatus.FORBIDDEN,
        common_1.HttpStatus.NOT_FOUND,
        common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    ];
    const isPaginated = options.isPaginated || false;
    const ok = {
        type: options.type,
        description: options?.description ?? 'OK',
        paginationType: options.paginationType || 'offset',
    };
    const errorResponses = (options.errorResponses || defaultErrorResponses)?.map((statusCode) => (0, swagger_1.ApiResponse)({
        status: statusCode,
        type: error_dto_1.ErrorDto,
        description: http_1.STATUS_CODES[statusCode],
    }));
    const serializers = [];
    if (typeof options.type === 'function') {
        serializers.push((0, serialize_1.Serialize)(options?.type));
    }
    return (0, common_1.applyDecorators)((0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: options?.summary, ...(options?.operations ?? {}) }), (0, common_1.HttpCode)(options.statusCode || defaultStatusCode), isPaginated ? (0, swagger_decorators_1.ApiPaginatedResponse)(ok) : (0, swagger_1.ApiOkResponse)(ok), ...serializers, ...errorResponses);
};
exports.ApiPublic = ApiPublic;
const ApiAuth = (options = {}) => {
    const defaultStatusCode = common_1.HttpStatus.OK;
    const defaultErrorResponses = [
        common_1.HttpStatus.BAD_REQUEST,
        common_1.HttpStatus.UNAUTHORIZED,
        common_1.HttpStatus.FORBIDDEN,
        common_1.HttpStatus.NOT_FOUND,
        common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    ];
    const isPaginated = options.isPaginated || false;
    const ok = {
        type: options.type,
        description: options?.description ?? 'OK',
        paginationType: options.paginationType || 'offset',
    };
    const errorResponses = (options.errorResponses || defaultErrorResponses)?.map((statusCode) => (0, swagger_1.ApiResponse)({
        status: statusCode,
        type: error_dto_1.ErrorDto,
        description: http_1.STATUS_CODES[statusCode],
    }));
    const serializers = [];
    if (typeof options.type === 'function') {
        serializers.push((0, serialize_1.Serialize)(options?.type));
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: options?.summary, ...(options?.operations ?? {}) }), (0, common_1.HttpCode)(options.statusCode || defaultStatusCode), isPaginated
        ? (0, swagger_decorators_1.ApiPaginatedResponse)(ok)
        : options.statusCode === 201
            ? (0, swagger_1.ApiCreatedResponse)(ok)
            : (0, swagger_1.ApiOkResponse)(ok), (0, swagger_1.ApiBearerAuth)(), ...serializers, ...errorResponses);
};
exports.ApiAuth = ApiAuth;
//# sourceMappingURL=http.decorators.js.map