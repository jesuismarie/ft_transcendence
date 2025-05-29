FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/src/app/dist .

COPY config/nginx/default.conf /etc/nginx/sites-available/default

CMD ["nginx", "-g", "daemon off;"]
