import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import multipart from '@fastify/multipart';
import fastifyHelmet from "@fastify/helmet";
import websocket from '@fastify/websocket';
import fastifyRateLimit from '@fastify/rate-limit'
import path from 'path';
import fs from 'fs';

// Plugins
import dbPlugin from './plugins/db';
import errorEnvelope from "./plugins/errorEnvelope";
import gameServiceClientPlugin from './plugins/gameServiceClient';
import liveSessionManagementPlugin from './plugins/live-session-management/plugin';

// Routes
import routes from './routes/routes';

const app = Fastify({
	logger: true,
	https: {
		key: fs.readFileSync(process.env.TLS_CERT_KEY || "default_cert.key"),
		cert: fs.readFileSync(process.env.TLS_CERT_PEM || "default_cert.pem"),
	},
});

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
	timeWindow: '1 hour'
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
