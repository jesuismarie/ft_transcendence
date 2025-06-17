import { createServer } from "https";
import path from "path";
import WebSocket from "ws";
import cors from '@fastify/cors';
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { handleSocketConnection } from "./socket";
import monitoringRoutes from "./monitoring/routes";
import healthRoute from "./routes/health";
import createMatchRoute from "./routes/createMatchRoute";
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

// Step 4: Wait for Fastify to initialize
app.ready().then((server) => {});

// const httpServer = createServer((req, res) => {
//   app.routing(req, res);
// });

const httpsOptions = {
    key: fs.readFileSync(process.env.TLS_CERT_KEY),
    cert: fs.readFileSync(process.env.TLS_CERT_PEM),
};

const httpServer = createServer(httpsOptions, (req, res) => {
    app.routing(req, res);
});

const wss = new WebSocket.Server({ server: httpServer });

wss.on("connection", handleSocketConnection);
app.register(healthRoute);
app.register(createMatchRoute);
app.register(monitoringRoutes);

// TODO: fix port
httpServer.listen(
  process.env.PORT ? Number(process.env.PORT) : 3000,
  process.env.HOST_NAME ? String(process.env.HOST_NAME) : "localhost",
  () => {
    console.log(
      `Running at http://${
        process.env.HOST_NAME ? process.env.HOST_NAME : "localhost"
      }:${process.env.PORT ? process.env.PORT : 3000}`
    );
  }
);
