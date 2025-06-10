import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import multipart from '@fastify/multipart';
import fastifyHelmet from "@fastify/helmet";
import websocket from '@fastify/websocket';
import fastifyRateLimit from '@fastify/rate-limit'
import cors from '@fastify/cors'
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';


dotenv.config();

// Plugins
import dbPlugin from './plugins/db';
import errorEnvelope from "./plugins/errorEnvelope";
import gameServiceClientPlugin from './plugins/gameServiceClient';
import liveSessionManagementPlugin from './plugins/live-session-management/plugin';

// Routes
import routes from './routes/routes';

const app = Fastify({ logger: true });

// app.register(cors, {
//     origin: true, // or (origin, cb) => cb(null, true)
//     credentials: true,
// 	methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
// 	allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
// });

// app.register(cors, {
// 	origin: '*',
// //   origin: true, // or (origin, cb) => cb(null, true)
// //   credentials: true,
// });

// make sure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
	fs.mkdirSync(publicDir, {recursive: true});
}
app.register(fastifyStatic, {
	root: publicDir,
	prefix: '/static/',
});
app.register(fastifyHelmet, {
	contentSecurityPolicy: false
});
app.register(fastifyRateLimit, {
	max: 10000,
	timeWindow: '30 minutes'
});
app.register(multipart, { limits: {fileSize: 1_000_000} });
app.register(websocket, {
	options: {
		maxPayload: 1048576, // 1 MB
	},
});

app.register(errorEnvelope);
app.register(dbPlugin);
app.register(gameServiceClientPlugin);
app.register(liveSessionManagementPlugin);

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
