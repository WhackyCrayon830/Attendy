FROM node:22-bookworm-slim AS base

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS development

COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npm ci --include=optional && npm run dev -- --hostname 0.0.0.0"]

FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", "./node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0"]
