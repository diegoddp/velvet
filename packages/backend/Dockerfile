# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Production stage
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Run migrations
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/index.js"]
