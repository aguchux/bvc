ARG APP_NAME=web

FROM node:20-bullseye-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages ./packages
RUN npm ci

FROM base AS builder
ARG APP_NAME
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build -- --filter=./apps/${APP_NAME}
RUN npm prune --omit=dev

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=7000
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/${APP_NAME} ./apps/${APP_NAME}
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/turbo.json ./turbo.json

EXPOSE 7000
USER nextjs

CMD ["npm", "--workspace", "apps/web", "run", "start"]
