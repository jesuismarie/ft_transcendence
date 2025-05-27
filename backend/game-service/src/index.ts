// src/index.ts
import Fastify from "fastify";
import initDb from "./db/index";
import matchInvitationRoutes from "./routes/matchInvitation/routes";
import matchRoutes from "./routes/match/routes";
import tournamentRoutes from "./routes/tournament/routes";
import internalRoutes from "./routes/internal/routes";

const app = Fastify({ logger: true });

// Регистрируем базу данных как плагин
app.register(initDb);

// Регистрируем маршруты
app.register(matchInvitationRoutes);
app.register(matchRoutes);
app.register(tournamentRoutes);
app.register(internalRoutes);

app.listen({ port: 3002 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
