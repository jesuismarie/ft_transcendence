import { createServer } from 'http';
import path from 'path';
import WebSocket from 'ws';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { handleSocketConnection } from './socket';


const app = Fastify();

// Step 4: Wait for Fastify to initialize
app.ready().then((server) => {});

const httpServer = createServer((req, res) => {
    app.routing(req, res);
});
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', handleSocketConnection);


httpServer.listen(Number(process.env.PORT) ?? 3000, String(process.env.HOST_NAME) ?? "localhost", () => {
    console.log(`Running at http://${process.env.HOST_NAME}:${process.env.PORT}`);
});