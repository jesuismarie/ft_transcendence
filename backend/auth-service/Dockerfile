FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build
RUN npm run generate
RUN npm run migrate:deploy
RUN npm run build

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/.npmrc ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json

CMD ["npm", "run", "start:prod"]
