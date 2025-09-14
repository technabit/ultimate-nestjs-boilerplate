"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplicitSerialize = ExplicitSerialize;
exports.Serialize = Serialize;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const operators_1 = require("rxjs/operators");
function ExplicitSerialize() {
    return (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor);
}
function Serialize(dto) {
    return (0, common_1.UseInterceptors)(new SerializeInterceptor(dto));
}
class SerializeInterceptor {
    dto;
    constructor(dto) {
        this.dto = dto;
    }
    intercept(context, handler) {
        return handler.handle().pipe((0, operators_1.map)((data) => {
            return (0, class_transformer_1.plainToInstance)(this.dto, data, {
                excludeExtraneousValues: true,
            });
        }));
    }
}
//# sourceMappingURL=serialize.js.map