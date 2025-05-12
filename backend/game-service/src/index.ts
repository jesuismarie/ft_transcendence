import Fastify from "fastify";
import { initDb } from "./db/index.ts";
import pingRoute from "./routes/ping.ts";
// import matchRoute from "./routes/match.js";
// import tournamentRoute from "./routes/tournament.js";

const app = Fastify({ logger: true });

await initDb();

app.register(pingRoute);
// app.register(matchRoute);
// app.register(tournamentRoute);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
