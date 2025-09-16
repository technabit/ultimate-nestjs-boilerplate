import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';
import 'dotenv/config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getConfig } from '../config/sentry/sentry.config';

function extractRequestForSentry(context: ExecutionContext) {
  try {
    const type = context.getType<'http' | 'graphql' | 'ws'>();
    if (type === 'http') {
      return context.switchToHttp().getRequest();
    }
    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      return gqlCtx.getContext()?.req;
    }
    if (type === 'ws') {
      return context.switchToWs().getClient();
    }
  } catch {}
  return undefined;
}

const enableSentry = (err: Error, context: ExecutionContext) => {
  if (err instanceof HttpException) {
    return throwError(() => err);
  }

  Sentry.withScope((scope) => {
    const req = extractRequestForSentry(context);
    if (req) {
      scope.addEventProcessor(async (event) =>
        Sentry.addRequestDataToEvent(event, req as any),
      );
    }
    Sentry.captureException(err);
  });

  return throwError(() => err);
};

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const sentryConfig = getConfig();
    const type = context.getType<'http' | 'graphql' | 'ws'>();

    // Only wrap HTTP for Sentry to avoid GraphQL/WS stream issues
    if (type !== 'http') {
      return next.handle();
    }

    if (sentryConfig.logging) {
      return next
        .handle()
        .pipe(catchError((err) => enableSentry(err, context)));
    }
    return next.handle().pipe(catchError((err) => throwError(() => err)));
  }
}
