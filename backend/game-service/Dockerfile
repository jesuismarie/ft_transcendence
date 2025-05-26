FROM node:20-alpine AS build

WORKDIR /app

# Copy only package manifests to leverage caching
COPY package.json package-lock.json ./
COPY backend/game-service/package.json ./backend/game-service/
COPY packages/api-types/package.json ./packages/api-types/

RUN npm install

COPY . .

RUN npm run --workspace=packages/api-types build
RUN npm run --workspace=backend/game-service build:prod

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/game-service/node_modules ./backend/game-service/node_modules
COPY --from=build /app/backend/game-service/package.json ./backend/game-service/package.json
COPY --from=build /app/backend/game-service/dist ./backend/game-service/dist
COPY --from=build /app/packages/api-types/dist ./packages/api-types/dist

CMD ["node", "backend/game-service/dist/index.js"]

