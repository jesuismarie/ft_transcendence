import Fastify from "fastify";
import monitorningRoutes from "./routes/monitoring/routes";
import errorEnvelope from "./plugins/errorEnvelope";
import cors from "@fastify/cors";
import httpProxy from "@fastify/http-proxy";
import { services } from "./config";
import authMiddleware from "./plugins/authMiddleware";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: '*',
//   origin: true, // or (origin, cb) => cb(null, true)
//   credentials: true,
  	methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
});

app.register(errorEnvelope);
authMiddleware(app);

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
app.register(monitorningRoutes);

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
