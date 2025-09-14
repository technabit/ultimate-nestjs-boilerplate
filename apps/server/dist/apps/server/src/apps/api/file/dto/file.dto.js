"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDto = void 0;
const tslib_1 = require("tslib");
const nest_core_1 = require("@app/nest-core");
const class_transformer_1 = require("class-transformer");
let FileDto = class FileDto {
    originalname;
    filename;
    mimetype;
    size;
    path;
};
exports.FileDto = FileDto;
tslib_1.__decorate([
    (0, nest_core_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], FileDto.prototype, "originalname", void 0);
tslib_1.__decorate([
    (0, nest_core_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], FileDto.prototype, "filename", void 0);
tslib_1.__decorate([
    (0, nest_core_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], FileDto.prototype, "mimetype", void 0);
tslib_1.__decorate([
    (0, nest_core_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], FileDto.prototype, "size", void 0);
tslib_1.__decorate([
    (0, nest_core_1.StringField)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], FileDto.prototype, "path", void 0);
exports.FileDto = FileDto = tslib_1.__decorate([
    (0, class_transformer_1.Exclude)()
], FileDto);
//# sourceMappingURL=file.dto.js.map