# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@12.11.2 --activate

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/prisma/package.json packages/prisma/package.json
RUN pnpm install --frozen-lockfile

FROM dependencies AS api-builder
COPY apps/api apps/api
COPY packages/contracts packages/contracts
COPY packages/prisma packages/prisma
RUN pnpm rebuild prisma @prisma/client
RUN pnpm --filter @dehradun/prisma generate
RUN pnpm --filter @dehradun/api build

FROM base AS api
ENV NODE_ENV=production
ENV API_PORT=3001
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=dependencies /app/packages/contracts/node_modules ./packages/contracts/node_modules
COPY --from=dependencies /app/packages/prisma/node_modules ./packages/prisma/node_modules
COPY --from=api-builder /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/prisma/package.json packages/prisma/package.json
COPY packages/prisma/prisma packages/prisma/prisma
RUN pnpm --filter @dehradun/prisma generate
RUN addgroup -S app && adduser -S app -G app && mkdir -p apps/api/uploads && chown -R app:app /app
USER app
EXPOSE 3001
CMD ["node", "apps/api/dist/apps/api/src/main.js"]

FROM dependencies AS web-builder
COPY apps/web apps/web
COPY packages/contracts packages/contracts
ENV NEXT_OUTPUT_STANDALONE=true
RUN pnpm --filter @dehradun/web build

FROM node:20-alpine AS web
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=web-builder /app/apps/web/.next/standalone ./
COPY --from=web-builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-builder /app/apps/web/public ./apps/web/public
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
