"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPaginatedResponse = void 0;
const paginated_dto_1 = require("../common/dto/cursor-pagination/paginated.dto");
const paginated_dto_2 = require("../common/dto/offset-pagination/paginated.dto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiPaginatedResponse = (options) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(options.paginationType === 'offset'
        ? paginated_dto_2.OffsetPaginatedDto
        : paginated_dto_1.CursorPaginatedDto, options.type), (0, swagger_1.ApiOkResponse)({
        description: options.description || `Paginated list of ${options.type.name}`,
        schema: {
            title: `PaginatedResponseOf${options.type.name}`,
            allOf: [
                {
                    $ref: (0, swagger_1.getSchemaPath)(options.paginationType === 'offset'
                        ? paginated_dto_2.OffsetPaginatedDto
                        : paginated_dto_1.CursorPaginatedDto),
                },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(options.type) },
                        },
                    },
                },
            ],
        },
    }));
};
exports.ApiPaginatedResponse = ApiPaginatedResponse;
//# sourceMappingURL=swagger.decorators.js.map