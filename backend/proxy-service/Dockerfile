FROM node:20-alpine AS build

WORKDIR /app

COPY ./backend/proxy-service .
COPY ./secrets/backend/npmrc-secrets/npmrc-secret.txt ./.npmrc

RUN npm install && npm run build:prod

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

RUN mkdir -p /var/log/app \
    && ln -sf /dev/stdout /var/log/app/access.log \
    && ln -sf /dev/stderr /var/log/app/error.log

CMD ["npm", "run", "start:prod"]

