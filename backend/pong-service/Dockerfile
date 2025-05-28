FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:prod

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]
