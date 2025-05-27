FROM node:20-alpine AS build

WORKDIR /app

COPY pong_canvas/package.json /app/pong_canvas/package.json

RUN npm install --prefix /app/pong_canvas

COPY . .

RUN npm --prefix /app/pong_canvas run build:prod

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/pong_canvas/package.json     /app/pong_canvas/package.json
COPY --from=build /app/pong_canvas/dist             /app/pong_canvas/dist
COPY --from=build /app/pong_canvas/node_modules     /app/pong_canvas/node_modules

CMD ["npm", "--prefix", "/app/pong_canvas", "run", "start:prod"]
