FROM oven/bun:1.4.3 AS base

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS development

COPY . .
EXPOSE 3000
CMD ["sh", "-c", "bun install --frozen-lockfile && bun run dev --hostname 0.0.0.0"]

FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN bun run build

FROM oven/bun:1.4.3 AS production

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app ./
EXPOSE 3000
CMD ["bun", "run", "start", "--hostname", "0.0.0.0"]
