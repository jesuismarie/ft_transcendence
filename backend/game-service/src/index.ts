// src/index.ts
import Fastify from "fastify";
import initDb from "./db/index";
import matchInvitationRoutes from "./routes/matchInvitation/routes";
import matchRoutes from "./routes/match/routes";
import tournamentRoutes from "./routes/tournament/routes";

const app = Fastify({ logger: true });

// Регистрируем базу данных как плагин
app.register(initDb);

// Регистрируем маршруты
app.register(matchInvitationRoutes);
app.register(matchRoutes)
app.register(tournamentRoutes)


app.listen({ port: 5001 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
