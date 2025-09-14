import { UserSession as UserSessionType } from '@/core/auth/auth.type';
import { type FastifyRequest } from 'fastify';
export type CurrentUserSession = UserSessionType & {
    headers: FastifyRequest['headers'];
};
export declare const CurrentUserSession: (...dataOrPipes: ("user" | "session" | "headers" | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
