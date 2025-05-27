import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import multipart from '@fastify/multipart';
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyHelmet from "@fastify/helmet";
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();

// Plugins
import dbPlugin from './plugins/db';
import errorEnvelope from "./plugins/errorEnvelope";

// Routes
import healthRoute from './routes/health';
import userRoutes from './routes/User/routes';
import friendRoutes from "./routes/Friend/routes";

const app = Fastify({ logger: true });

app.register(fastifyStatic, {
	root: path.join(process.cwd(), 'public'),
	prefix: '/static/',
});
app.register(fastifyHelmet, {
	contentSecurityPolicy: false
});
app.register(fastifyRateLimit, {
	max: 1000,
	timeWindow: '1 hour'
});
app.register(multipart, { limits: {fileSize: 1_000_000} });

app.register(errorEnvelope);
app.register(dbPlugin);

app.register(healthRoute);
app.register(userRoutes);
app.register(friendRoutes);

app.listen({ port: Number(process.env.PORT) ?? 3000, host: '0.0.0.0' }).catch((err) => {
	app.log.error(err);
	process.exit(1);
});