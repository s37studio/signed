# Dockerfile pour le backend Hono
FROM oven/bun:1 AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Copy root files
COPY package.json bun.lock ./
COPY turbo.json ./

# Copy workspace packages
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

# Copy server
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN bun install

# Stage 2: Build
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy source
COPY packages ./packages
COPY apps/server ./apps/server
COPY turbo.json ./

# Generate Prisma Client (with dummy DATABASE_URL for build time)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN cd packages/db && bun run prisma generate

# Build server
RUN cd apps/server && bun run build

# Stage 3: Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "run", "apps/server/dist/index.js"]
