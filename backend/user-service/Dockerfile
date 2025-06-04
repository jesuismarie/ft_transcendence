FROM node:20-alpine AS build

WORKDIR /app

COPY ./backend/user-service .
COPY ./secrets/backend/npmrc-secrets/npmrc-secret.txt ./.npmrc

RUN npm install && npm run build:prod

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/package.json ./package.json

CMD ["npm", "run", "start:prod"]
