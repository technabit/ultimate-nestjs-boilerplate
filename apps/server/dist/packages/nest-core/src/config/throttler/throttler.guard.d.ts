import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';
export declare class AppThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext): {
        req: any;
        res: any;
    };
    protected getTracker(req: FastifyRequest): Promise<string>;
}
