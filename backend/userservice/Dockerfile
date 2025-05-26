FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/userservice/package.json ./backend/userservice/
COPY packages/api-types/package.json ./packages/api-types/

RUN npm install

COPY . .

RUN npm run --workspace=packages/api-types build
RUN npm run --workspace=backend/userservice build:prod

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/userservice/node_modules ./backend/userservice/node_modules
COPY --from=build /app/backend/userservice/package.json ./backend/userservice/package.json
COPY --from=build /app/backend/userservice/dist ./backend/userservice/dist
COPY --from=build /app/packages/api-types/dist ./packages/api-types/dist

CMD ["node", "backend/userservice/dist/index.js"]

