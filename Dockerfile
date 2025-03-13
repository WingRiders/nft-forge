FROM oven/bun:1.2.3 AS builder

WORKDIR /app

COPY package.json bun.lockb next.config.ts tsconfig.json declarations.d.ts ./

COPY src/ ./src/

# Install all dependencies for build
RUN bun install --frozen-lockfile

RUN bun run build

# Install only production dependencies after build
RUN bun install --production --frozen-lockfile

FROM oven/bun:1.2.3-slim

# Install wget
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules

CMD ["bun", "run", "start"]
