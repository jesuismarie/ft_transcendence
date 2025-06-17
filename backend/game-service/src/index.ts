// Entry point for game-service
// Core Imports
import Fastify from "fastify";
import fs from 'fs';

// Plugins
import errorEnvelope from "./plugins/errorEnvelope";
import initDb from "./db/index";

// Routes
import matchRoutes from "./routes/match/routes";
import tournamentRoutes from "./routes/tournament/routes";
import internalRoutes from "./routes/internal/routes";
import monitoringRoutes from "./routes/monitoring/routes";

const app = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync(process.env.TLS_CERT_KEY || "default_cert.key"),
        cert: fs.readFileSync(process.env.TLS_CERT_PEM || "default_cert.pem"),
    },
});

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
