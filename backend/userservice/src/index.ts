import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import multipart from '@fastify/multipart';
import path from 'path';

// Plugins
import dbPlugin from './plugins/db';
import errorEnvelope from "./plugins/errorEnvelope";

// Routes
import healthRoute from './routes/health';
import userRoutes from './routes/users';
import friendRoutes from "./routes/friends";

const app = Fastify({ logger: true });

app.register(multipart, { limits: {fileSize: 1_000_000} });
app.register(fastifyStatic, {
	root: path.join(process.cwd(), 'public'),
	prefix: '/static/',
});

app.register(errorEnvelope);
app.register(dbPlugin);

app.register(healthRoute);
app.register(userRoutes);
app.register(friendRoutes);

app.listen({ port: 3000, host: '0.0.0.0' }).catch((err) => {
	app.log.error(err);
	process.exit(1);
});