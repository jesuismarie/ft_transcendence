import Fastify from "fastify";
import gameServiceRoutes from "./routes/game-service/routes";
import monitorningRoutes from "./routes/monitoring/routes";
import errorEnvelope from "./plugins/errorEnvelope";
import multipart from "@fastify/multipart";
import httpProxy from "@fastify/http-proxy";
import { services } from "./config";

const app = Fastify({ logger: true });
app.register(multipart, { limits: { fileSize: 1_000_000 } });

// Регистрируем маршруты
// app.register(authServiceRoutes);
app.register(gameServiceRoutes);
// app.register(userServiceRoutes);
app.register(errorEnvelope);
app.register(httpProxy, {
  upstream: services.userService,
  prefix: "/user-service",
});
app.register(httpProxy, {
  upstream: services.authService,
  prefix: "/auth-service",
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
