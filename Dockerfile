ARG NODE_IMAGE=node:20-slim

FROM ${NODE_IMAGE} AS base

RUN apt-get update && apt-get install -y procps

RUN npm install -g pnpm@9.12.2

# Development stage
FROM base AS development
WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

# Build stage
FROM base AS builder
WORKDIR /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/apps ./apps
COPY --chown=node:node --from=development /app/packages ./packages
COPY --chown=node:node --from=development /app/prisma ./prisma
COPY --chown=node:node --from=development /app/scripts ./scripts
COPY --chown=node:node --from=development /app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=development /app/tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node --from=development /app/nest-cli.json ./nest-cli.json
COPY --chown=node:node --from=development /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --chown=node:node --from=development /app/turbo.json ./turbo.json
COPY --chown=node:node --from=development /app/.env ./.env

# Build workspace (server app and its deps)
RUN pnpm turbo run build --filter=server

# Generate Prisma client and run migrations & seed (if present)
RUN pnpm prisma:generate \
 && (test -d prisma/migrations && pnpm prisma:migrate:deploy || echo 'No Prisma migrations to deploy') \
 && (node -e "process.exit(require('fs').existsSync('prisma/seed.ts')?0:1)" && pnpm db:seed || echo 'No Prisma seed to run')

# Removes unnecessary packages and re-install only production dependencies
ENV NODE_ENV production
RUN pnpm prune --prod
RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile --prod

USER node

# Production stage
FROM ${NODE_IMAGE} AS production
WORKDIR /app

RUN npm install -g pm2

RUN chown -R node:node /app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=development /app/pm2.config.json ./

USER node

CMD ["sh", "-lc", "pm2-runtime start pm2.config.json --only ${PM2_ONLY:-nestjs-boilerplate}"]
