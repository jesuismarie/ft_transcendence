FROM node:18 AS build

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY . .

WORKDIR /app/frontend

RUN npx vite build && npx tsc

FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]