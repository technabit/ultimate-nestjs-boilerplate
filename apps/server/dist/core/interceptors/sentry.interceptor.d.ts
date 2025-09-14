import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import 'dotenv/config';
import { Observable } from 'rxjs';
export declare class SentryInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>;
}
