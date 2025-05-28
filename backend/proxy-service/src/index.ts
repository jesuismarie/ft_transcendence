import Fastify from "fastify";
import authServiceRoutes from "./routes/auth-service/routes";
import gameServiceRoutes from "./routes/game-service/routes";
import userServiceRoutes from "./routes/user-service/routes";
import errorEnvelope from "./plugins/errorEnvelope";
import multipart from "@fastify/multipart";

const app = Fastify({ logger: true });
app.register(multipart, { limits: { fileSize: 1_000_000 } });

// Регистрируем маршруты
app.register(authServiceRoutes);
app.register(gameServiceRoutes);
app.register(userServiceRoutes);
app.register(errorEnvelope);

app.listen(
  {
    port: process.env.PORT ? Number(process.env.PORT) : 3001,
    host: process.env.HOST_NAME ? String(process.env.HOST_NAME) : "localhost",
  },
  (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
);
