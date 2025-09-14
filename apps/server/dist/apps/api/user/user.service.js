"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const better_auth_service_1 = require("../../../core/auth/better-auth.service");
const cursor_pagination_dto_1 = require("../../../core/common/dto/cursor-pagination/cursor-pagination.dto");
const paginated_dto_1 = require("../../../core/common/dto/cursor-pagination/paginated.dto");
const paginated_dto_2 = require("../../../core/common/dto/offset-pagination/paginated.dto");
const prisma_service_1 = require("../../../core/database/prisma/prisma.service");
const prisma_cursor_pagination_1 = require("../../../core/utils/pagination/prisma-cursor-pagination");
const prisma_offset_pagination_1 = require("../../../core/utils/pagination/prisma-offset-pagination");
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
let UserService = class UserService {
    i18nService;
    prisma;
    betterAuthService;
    constructor(i18nService, prisma, betterAuthService) {
        this.i18nService = i18nService;
        this.prisma = prisma;
        this.betterAuthService = betterAuthService;
    }
    async findAllUsers(dto) {
        const [users, metaDto] = await (0, prisma_offset_pagination_1.paginateOffsetPrisma)(this.prisma.user, {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        }, dto, { skipCount: false, takeAll: false });
        return new paginated_dto_2.OffsetPaginatedDto(users, metaDto);
    }
    async findAllUsersCursor(reqDto) {
        const { data, cursor } = await (0, prisma_cursor_pagination_1.paginateCursorPrisma)({
            delegate: this.prisma.user,
            where: { deletedAt: null },
            paginationKeys: ['createdAt', 'id'],
            query: {
                limit: reqDto.limit,
                order: 'DESC',
                afterCursor: reqDto.afterCursor,
                beforeCursor: reqDto.beforeCursor,
            },
        });
        const metaDto = new cursor_pagination_dto_1.CursorPaginationDto(data.length, cursor.afterCursor, cursor.beforeCursor, reqDto);
        return new paginated_dto_1.CursorPaginatedDto(data, metaDto);
    }
    async findOneUser(id) {
        const user = await this.prisma.user.findFirst({
            where: { id: String(id), deletedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException(this.i18nService.t('user.notFound'));
        }
        return user;
    }
    async deleteUser(id) {
        const exists = await this.prisma.user.findFirst({
            where: { id: String(id), deletedAt: null },
            select: { id: true },
        });
        if (!exists) {
            throw new common_1.NotFoundException(this.i18nService.t('user.notFound'));
        }
        await this.prisma.user.update({
            where: { id: String(id) },
            data: { deletedAt: new Date() },
        });
        return common_1.HttpStatus.OK;
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateUserProfile(userId, dto, options) {
        let shouldChangeUsername = !(dto.username == null);
        if (shouldChangeUsername) {
            const user = await this.prisma.user.findFirst({
                where: { id: String(userId), deletedAt: null },
                select: { id: true, username: true },
            });
            shouldChangeUsername = user?.username !== dto.username;
        }
        await this.betterAuthService.api.updateUser({
            body: {
                ...(dto.image !== undefined ? { image: dto.image } : {}),
                ...(shouldChangeUsername ? { username: dto.username } : {}),
            },
            headers: options?.headers,
        });
        await this.prisma.user.update({
            where: { id: String(userId) },
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
        });
        return await this.findOneUser(userId);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [nestjs_i18n_1.I18nService,
        prisma_service_1.PrismaService,
        better_auth_service_1.BetterAuthService])
], UserService);
//# sourceMappingURL=user.service.js.map