// Core module + top-level factories
export { BULL_BOARD_PATH } from './config/bull/bull.config';
export { default as useThrottlerFactory } from './config/throttler/throttler.factory';
export { AppThrottlerGuard } from './config/throttler/throttler.guard';
export { CoreModule } from './core.module';
export { default as useGraphqlFactory } from './graphql/graphql-fastify.factory';
export { default as useI18nFactory } from './i18n/i18n.factory';

// Bootstrap helpers
export * from './bootstrap/bootstrap';

// Config (avoid name collisions like generic getConfig)
export { getConfig as getAppConfig } from './config/app/app.config';
export type { GlobalConfig } from './config/config.type';

// Prisma
export * from './database/prisma/prisma.service';

// Decorators
export * from './decorators/auth/current-user-session.decorator';
export * from './decorators/field.decorators';
export * from './decorators/http.decorators';
export * from './decorators/public.decorator';

// Auth
export * from './auth/auth.guard';
export * from './auth/auth.service';
export * from './auth/better-auth.service';

// Common DTOs
export * from './common/dto/cursor-pagination/cursor-pagination.dto';
export * from './common/dto/cursor-pagination/paginated.dto';
export * from './common/dto/error.dto';
export * from './common/dto/offset-pagination/offset-pagination.dto';
export * from './common/dto/offset-pagination/paginated.dto';
// Export page options with disambiguated names
export { PageOptionsDto as CursorPageOptionsDto } from './common/dto/cursor-pagination/page-options.dto';
export { PageOptionsDto as OffsetPageOptionsDto } from './common/dto/offset-pagination/page-options.dto';

// Health
export * from './health/prisma.health';

// Interceptors
export { default as FileUploadInterceptor } from './interceptors/file-upload.interceptor';

// Services
export * from './services/aws/aws-s3.service';
export * from './services/aws/aws.module';

// Shared modules/services
export * from './shared/mail/mail.service';
export * from './shared/socket/socket.module';

// Tools
export * from './tools/swagger/swagger.setup';

// Utils
export * from './utils/interceptors/serialize';
export * from './utils/pagination/prisma-cursor-pagination';
export * from './utils/pagination/prisma-offset-pagination';

// Public constants and types
export * from './constants/job.constant';
export * from './constants/mail.constant';
export * from './types/common';
