import { createServer } from "https";
import WebSocket from "ws";
import Fastify from "fastify";
import { handleSocketConnection } from "./socket";
import healthRoute from "./routes/health";
import createMatchRoute from "./routes/createMatchRoute";
import fs from 'fs';

const app = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync(process.env.TLS_CERT_KEY || "default_cert.key"),
        cert: fs.readFileSync(process.env.TLS_CERT_PEM || "default_cert.pem"),
    },
});

// Step 4: Wait for Fastify to initialize
app.ready().then((server) => {});

const httpsOptions = {
    key: fs.readFileSync(process.env.TLS_CERT_KEY || "default_cert.key"),
    cert: fs.readFileSync(process.env.TLS_CERT_PEM || "default_cert.pem"),
};

const httpServer = createServer(httpsOptions, (req, res) => {
    app.routing(req, res);
});

const wss = new WebSocket.Server({ server: httpServer });

wss.on("connection", handleSocketConnection);
app.register(healthRoute);
app.register(createMatchRoute);

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
