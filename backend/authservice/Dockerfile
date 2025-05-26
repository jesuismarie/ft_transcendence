FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run --workspace=packages/api-types build
RUN npm run --workspace=backend/authservice generate
RUN npm run --workspace=backend/authservice migrate:deploy
RUN npm run --workspace=backend/authservice build

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=build /app/backend/authservice/dist ./backend/authservice/dist
COPY --from=build /app/backend/authservice/prisma ./backend/authservice/prisma
COPY --from=build /app/packages/api-types/dist ./packages/api-types/dist

CMD ["node", "backend/authservice/dist/app.js"]
