"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueOverviewDto = exports.QueueCountsDto = exports.HealthCheckDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class HealthCheckDto {
    status;
    details;
}
exports.HealthCheckDto = HealthCheckDto;
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], HealthCheckDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Object)
], HealthCheckDto.prototype, "details", void 0);
class QueueCountsDto {
    waiting;
    active;
    completed;
    failed;
    delayed;
    paused;
    waitingChildren;
}
exports.QueueCountsDto = QueueCountsDto;
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Number)
], QueueCountsDto.prototype, "waiting", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Number)
], QueueCountsDto.prototype, "active", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Number)
], QueueCountsDto.prototype, "completed", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Number)
], QueueCountsDto.prototype, "failed", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Number)
], QueueCountsDto.prototype, "delayed", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Number)
], QueueCountsDto.prototype, "paused", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ name: 'waiting-children' }),
    tslib_1.__metadata("design:type", Number)
], QueueCountsDto.prototype, "waitingChildren", void 0);
class QueueOverviewDto {
    name;
    counts;
    bullBoardUrl;
}
exports.QueueOverviewDto = QueueOverviewDto;
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", String)
], QueueOverviewDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: QueueCountsDto }),
    tslib_1.__metadata("design:type", QueueCountsDto)
], QueueOverviewDto.prototype, "counts", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", String)
], QueueOverviewDto.prototype, "bullBoardUrl", void 0);
//# sourceMappingURL=health.dto.js.map