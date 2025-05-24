# auth-service/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# 1. Install production deps first (layer-caching)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2. Copy source and Prisma stuff
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# 3. Generate Prisma client & migrate schema
RUN npx prisma generate
RUN npx prisma migrate deploy

# 4. Compile TS → JS
RUN npx tsc --build

# 5. Final image (smaller)
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/app.js"]
