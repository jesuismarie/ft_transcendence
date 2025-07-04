// Core Imports
import Fastify from "fastify";
import httpProxy from "@fastify/http-proxy";
import cors from "@fastify/cors";
import fs from "fs";

// Plugins
import authMiddleware from "./plugins/authMiddleware";
import errorEnvelope from "./plugins/errorEnvelope";

import { services } from "./config";

const app = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(process.env.TLS_CERT_KEY || "default_cert.key"),
    cert: fs.readFileSync(process.env.TLS_CERT_PEM || "default_cert.pem"),
  },
});

app.register(cors, {
  origin: ['https://localhost', "https://10.128.2.100"],
  	methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
});

app.register(errorEnvelope);
app.register(authMiddleware);

// Регистрируем маршруты
app.register(httpProxy,{
  upstream: services.gameService,
  prefix: "/game-service",
});
app.register(httpProxy, {
  upstream: services.userService,
  prefix: "/user-service",
});
app.register(httpProxy, {
  upstream: services.authService,
  prefix: "/auth-service",
});
app.register(httpProxy, {
  upstream: services.pongService,
  prefix: "/pong-service",
});

app.listen(
  {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.HOST_NAME ? String(process.env.HOST_NAME) : "localhost",
  },
  (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
);
