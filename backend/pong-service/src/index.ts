import { createServer } from "http";
import path from "path";
import WebSocket from "ws";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { handleSocketConnection } from "./socket";
import monitoringRoutes from "./monitoring/routes";

const app = Fastify();

// Step 4: Wait for Fastify to initialize
app.ready().then((server) => {});

const httpServer = createServer((req, res) => {
  app.routing(req, res);
});
const wss = new WebSocket.Server({ server: httpServer });

wss.on("connection", handleSocketConnection);
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
