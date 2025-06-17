import Fastify from "fastify";
import initDb from "./db/index";
import cors from '@fastify/cors';
import matchRoutes from "./routes/match/routes";
import tournamentRoutes from "./routes/tournament/routes";
import internalRoutes from "./routes/internal/routes";
import monitoringRoutes from "./routes/monitoring/routes";
import errorEnvelope from "./plugins/errorEnvelope";
import fs from 'fs';

const app = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync(process.env.TLS_CERT_KEY),
        cert: fs.readFileSync(process.env.TLS_CERT_PEM),
    },
});
// app.register(cors, {
//     origin: true, // or (origin, cb) => cb(null, true)
//     credentials: true
// });
// Регистрируем базу данных как плагин
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
