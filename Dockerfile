# Multi-stage Dockerfile for FlowPilot AI

# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN npm ci

# Copy source trees
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
COPY apps/web ./apps/web

# Build all packages
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Copy built artifacts and production dependencies
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/dist ./packages/shared/dist
COPY apps/api/package.json ./apps/api/
COPY apps/api/dist ./apps/api/dist
COPY apps/web/dist ./apps/web/dist

RUN npm ci --omit=dev

EXPOSE 4000

CMD ["node", "apps/api/dist/server.js"]
