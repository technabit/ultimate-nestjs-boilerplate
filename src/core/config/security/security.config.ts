import { type GlobalConfig } from '@/core/config/config.type';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import type { HelmetOptions } from 'helmet';

const APOLLO_SANDBOX_CDN = 'https://embeddable-sandbox.cdn.apollographql.com';
const APOLLO_SANDBOX_EMBED = 'https://sandbox.embed.apollographql.com';
const APOLLO_LANDING_CDN =
  'https://apollo-server-landing-page.cdn.apollographql.com';
const JSDELIVR_CDN = 'https://cdn.jsdelivr.net';
const SCALAR_CDN = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';

export function getCorsOptions(
  configService: ConfigService<GlobalConfig>,
): CorsOptions {
  const env = configService.get('app.nodeEnv', { infer: true });
  const isDevLike = env === 'development' || env === 'local' || env === 'test';

  let origin = configService.getOrThrow('app.corsOrigin', { infer: true }) as
    | boolean
    | string
    | string[];

  if (isDevLike) {
    const devAllow = [
      'https://studio.apollographql.com',
      'https://sandbox.embed.apollographql.com',
    ];
    if (origin === '*') {
      // no change needed
    } else if (origin === true) {
      // allow all
    } else if (Array.isArray(origin)) {
      origin = Array.from(new Set([...origin, ...devAllow]));
    } else if (typeof origin === 'string') {
      origin = Array.from(new Set([origin, ...devAllow]));
    }
  }

  return {
    origin: origin as any,
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'x-lang',
    ],
    credentials: true,
  };
}

export function getHelmetOptions(
  configService: ConfigService<GlobalConfig>,
): HelmetOptions {
  const env = configService.get('app.nodeEnv', { infer: true });
  const isDevLike = env === 'development' || env === 'local' || env === 'test';

  const csp = {
    directives: {
      defaultSrc: ["'self'"],
      // Better Auth API Reference (Scalar) always allowed
      scriptSrc: [
        "'self'",
        SCALAR_CDN,
        ...(isDevLike
          ? [
              "'unsafe-inline'",
              "'unsafe-eval'",
              JSDELIVR_CDN,
              APOLLO_SANDBOX_CDN,
              APOLLO_LANDING_CDN,
            ]
          : []),
      ],
      styleSrc: [
        "'self'",
        ...(isDevLike
          ? ["'unsafe-inline'", JSDELIVR_CDN, 'https://fonts.googleapis.com']
          : []),
      ],
      imgSrc: [
        "'self'",
        'data:',
        ...(isDevLike
          ? [JSDELIVR_CDN, APOLLO_SANDBOX_CDN, APOLLO_LANDING_CDN]
          : []),
      ],
      fontSrc: [
        "'self'",
        'data:',
        ...(isDevLike ? ['https://fonts.gstatic.com'] : []),
      ],
      connectSrc: [
        "'self'",
        ...(isDevLike
          ? ['ws:', 'wss:', APOLLO_SANDBOX_CDN, APOLLO_SANDBOX_EMBED]
          : []),
      ],
      frameSrc: [
        "'self'",
        ...(isDevLike ? [APOLLO_SANDBOX_CDN, APOLLO_SANDBOX_EMBED] : []),
      ],
      manifestSrc: ["'self'", ...(isDevLike ? [APOLLO_LANDING_CDN] : [])],
    },
  } as const;

  return {
    // Helmet’s type here is a union (boolean | options). Cast to satisfy TS while providing the full options at runtime.
    contentSecurityPolicy:
      csp as unknown as HelmetOptions['contentSecurityPolicy'],
  };
}
