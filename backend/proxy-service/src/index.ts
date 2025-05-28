import Fastify from "fastify";
import authServiceRoutes from "./routes/auth-service/routes";
import gameServiceRoutes from "./routes/game-service/routes";
import userServiceRoutes from "./routes/user-service/routes";
import errorEnvelope from "./plugins/errorEnvelope";

const app = Fastify({ logger: true });

// Регистрируем маршруты
app.register(authServiceRoutes);
app.register(gameServiceRoutes);
app.register(userServiceRoutes);
app.register(errorEnvelope);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
