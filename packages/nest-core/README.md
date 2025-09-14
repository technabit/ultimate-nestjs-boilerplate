@technabit/nest-core

Summary
- Library of shared NestJS modules, configs, and utilities used by Technabit apps.

Installation model
- This package does not bundle framework/runtime libraries. Consumers must provide them.
- Those requirements are declared in `peerDependencies` (many are optional).

Why peerDependencies
- Keeps a single copy of NestJS/Fastify/Prisma/etc. in the consuming app.
- Avoids version drift and duplicate installs in the monorepo.
- Matches the build: `tsup` skips bundling node modules.

What to add in your app
- Ensure your app depends on the packages you actually use from nest-core, for example:
  - `@nestjs/{common,core,config,graphql,swagger,terminus,throttler,bullmq}`
  - `fastify`, `@fastify/cookie`, `fastify-multer` or `@nest-lab/fastify-multer`
  - `nestjs-i18n`, `class-validator`, `class-transformer`
  - `bullmq`, `ioredis`, `cache-manager`, `cache-manager-ioredis-yet`
  - `@prisma/client`, `pg`
  - Optional: `@sentry/node`, `nestjs-pino`, `pino-http`, `@willsoto/nestjs-prometheus`, `@aws-sdk/client-s3`

Package deps
- `dependencies`: only `tslib` (runtime helper)
- `devDependencies`: build/test tooling only (`tsup`, `typescript`)

Build
- `pnpm --filter @technabit/nest-core build`
- Outputs to `dist/` with CJS, ESM, and type declarations.

