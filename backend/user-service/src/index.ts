import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyHelmet from "@fastify/helmet";
import cors from '@fastify/cors';
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Plugins
import dbPlugin from "./plugins/db";
import errorEnvelope from "./plugins/errorEnvelope";
import gameServiceClientPlugin from "./plugins/gameServiceClient";

// Routes
import routes from "./routes/routes";

const app = Fastify({ logger: true });

app.register(cors, {
    origin: true, // or (origin, cb) => cb(null, true)
    credentials: true
});

app.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/static/",
});

// app.register(fastifyHelmet, {
//   // contentSecurityPolicy: false,
// });
app.register(fastifyRateLimit, {
  max: 1000,
  timeWindow: "1 hour",
});
app.register(multipart, { limits: { fileSize: 1_000_000 } });

app.register(errorEnvelope);
app.register(dbPlugin);
app.register(gameServiceClientPlugin);

app.register(routes);

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3003,
    host: process.env.HOST_NAME ? String(process.env.HOST_NAME) : "localhost",
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
