# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend ./
COPY shared /app/shared
RUN npx nest build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev
COPY --from=builder /app/backend/dist ./dist
EXPOSE 3000
CMD ["node", "dist/backend/src/main.js"]


