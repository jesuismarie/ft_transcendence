import fastify from 'fastify';
import { ajv } from './schemas/base';
import createUserRoute from './routes/create-user';
import getUsersRoute from './routes/get-users';
import getUserByIdRoute from './routes/get-user-by-id';
import healthRoutes from './routes/health';
import db from './db';

const app = fastify({ logger: true });
app.setValidatorCompiler(({ schema }) => ajv.compile(schema));

const start = async () => {
  try {
    await healthRoutes(app);
    await createUserRoute(app);
    await getUsersRoute(app);
    await getUserByIdRoute(app);

    await app.listen({ port: 3000, host: '0.0.0.0' });
    app.log.info('UserService running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
