FROM node:20-alpine AS build

WORKDIR /app

COPY ./backend/auth-service .
COPY ./secrets/backend/npmrc-secrets/npmrc-secret.txt ./.npmrc

RUN npm install && npm run generate && npm run migrate:deploy && npm run build:prod

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/.npmrc ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json

CMD ["npm", "run", "start:prod"]
