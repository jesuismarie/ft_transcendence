// AuthService entry point

// Core Imports
import Fastify, {FastifyInstance} from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

// Plugins
import envPlugin from './plugins/env';
import jwtPlugin from './plugins/jwt';
import prismaPlugin from './plugins/prisma';

// Import routes
import healthRoute from './routes/health';

// Build the Fastify server
const buildServer = () => {
	const app:FastifyInstance = Fastify({ logger: true });
	
	app.register(envPlugin);
	app.register(helmet);
	app.register(rateLimit, { max: 10, timeWindow: '1 minute' });
	app.register(prismaPlugin);
	app.register(jwtPlugin);
	
	// Register routes
	app.register(healthRoute);
	
	return app;
};

// Start the server if launched as a standalone application
if (require.main === module) {
	const server = buildServer();
	server.listen({ port: 3000, host: '0.0.0.0' }).catch((err) => {
		server.log.error(err);
		process.exit(1);
	});
}

// Export the server for testing
export default buildServer;
