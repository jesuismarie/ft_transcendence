// src/index.ts
import Fastify from "fastify";
import initDb from "./db/index.ts";
import pingRoute from "./routes/ping.ts";
import matchInvitationRoutes from "./routes/matchInvitation/routes.ts";

const app = Fastify({ logger: true });

// Регистрируем базу данных как плагин
app.register(initDb);

// Регистрируем маршруты
app.register(pingRoute);
app.register(matchInvitationRoutes);


app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
