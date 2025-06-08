import Fastify from "fastify";
import initDb from "./db/index";
import cors from '@fastify/cors';
import matchRoutes from "./routes/match/routes";
import tournamentRoutes from "./routes/tournament/routes";
import internalRoutes from "./routes/internal/routes";
import monitoringRoutes from "./routes/monitoring/routes";
import errorEnvelope from "./plugins/errorEnvelope";

const app = Fastify({ logger: true });

app.register(cors, {
    origin: true,
    credentials: true
});

// Регистрируем плагины
app.register(initDb);
app.register(errorEnvelope);



// Регистрируем маршруты
app.register(matchRoutes);
app.register(tournamentRoutes);
app.register(internalRoutes);
app.register(monitoringRoutes);



app.listen(
  {
    port: process.env.PORT ? Number(process.env.PORT) : 3002,
    host: process.env.HOST_NAME ? String(process.env.HOST_NAME) : "localhost",
  },
  (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
);
