FROM node:18-alpine AS builder

WORKDIR /app

COPY ./frontend .

RUN npm i && npm run build:prod

FROM nginx:alpine AS production

RUN apk update && \
    apk upgrade && \
    apk add --no-cache nginx openssl

RUN mkdir -p /etc/nginx/ssl && \
    openssl req -newkey rsa:4096 -x509 -sha256 \
    -days 365 -nodes \
    -out /etc/nginx/ssl/gehovhan.42.fr.pem \
    -keyout /etc/nginx/ssl/gehovhan.42.fr.key \
    -subj "/C=AM/ST=Yerevan/L=Yerevan/O=42Yerevan/OU=IT/CN=localhost"

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .
COPY --from=builder /app/config/nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
