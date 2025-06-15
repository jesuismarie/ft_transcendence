FROM node:18-alpine AS builder

WORKDIR /app

COPY ./frontend .
COPY secrets/frontend/frontend-secrets.txt ./.env

RUN npm install && npm run build:prod

FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

RUN mkdir -p /etc/ssl && rm -rf ./*

COPY --from=builder /app/dist .
COPY --from=builder /app/config/nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
