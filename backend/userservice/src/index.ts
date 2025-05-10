import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

// Plugins
import dbPlugin from './plugins/db';

// Routes
import healthRoute from './routes/health';
import userRoutes from './routes/users';
import friendRoutes from "./routes/friends";

const app = Fastify({ logger: true });

app.register(dbPlugin);
app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
  prefix: '/static/',
});

app.register(healthRoute);
app.register(userRoutes);
app.register(friendRoutes);

app.setErrorHandler((err, _req, reply) => {
  app.log.error(err);
  reply.code(500).send({ error: 'Internal Server Error' });
});

app.listen({ port: 3000, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});