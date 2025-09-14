"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOptions = getCorsOptions;
exports.getHelmetOptions = getHelmetOptions;
const APOLLO_SANDBOX_CDN = 'https://embeddable-sandbox.cdn.apollographql.com';
const APOLLO_SANDBOX_EMBED = 'https://sandbox.embed.apollographql.com';
const APOLLO_LANDING_CDN = 'https://apollo-server-landing-page.cdn.apollographql.com';
const JSDELIVR_CDN = 'https://cdn.jsdelivr.net';
const SCALAR_CDN = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
function getCorsOptions(configService) {
    const env = configService.get('app.nodeEnv', { infer: true });
    const isDevLike = env === 'development' || env === 'local' || env === 'test';
    let origin = configService.getOrThrow('app.corsOrigin', { infer: true });
    if (isDevLike) {
        const devAllow = [
            'https://studio.apollographql.com',
            'https://sandbox.embed.apollographql.com',
        ];
        if (origin === '*') {
        }
        else if (origin === true) {
        }
        else if (Array.isArray(origin)) {
            origin = Array.from(new Set([...origin, ...devAllow]));
        }
        else if (typeof origin === 'string') {
            origin = Array.from(new Set([origin, ...devAllow]));
        }
    }
    return {
        origin: origin,
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
function getHelmetOptions(configService) {
    const env = configService.get('app.nodeEnv', { infer: true });
    const isDevLike = env === 'development' || env === 'local' || env === 'test';
    const csp = {
        directives: {
            defaultSrc: ["'self'"],
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
    };
    return {
        contentSecurityPolicy: csp,
    };
}
//# sourceMappingURL=security.config.js.map