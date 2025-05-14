// src/index.ts
import Fastify from "fastify";
import initDb from "./db/index.ts";
import matchInvitationRoutes from "./routes/matchInvitation/routes.ts";
import matchRoutes from "./routes/match/routes.ts";
import tournamentRoutes from "./routes/tournament/routes.ts";

const app = Fastify({ logger: true });

// Регистрируем базу данных как плагин
app.register(initDb);

// Регистрируем маршруты
app.register(matchInvitationRoutes);
app.register(matchRoutes)
app.register(tournamentRoutes)


app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
