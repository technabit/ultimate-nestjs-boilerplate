FROM node:20-alpine AS base
WORKDIR /app

FROM base AS development
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

FROM base AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=development /app /app
RUN pnpm turbo run build --filter=@technabit/backend-api

FROM base AS production
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
CMD ["node", "dist/apps/backend-api/main.js"]
