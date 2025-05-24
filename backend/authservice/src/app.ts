import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import prismaPlugin from './plugins/prisma';
import dotenv from 'dotenv';

// dotenv
dotenv.config();

// Import routes
import healthRoute from './routes/health';

// Build the Fastify server
const buildServer = () => {
	const app = Fastify({ logger: true });
	
	app.register(helmet);
	app.register(rateLimit, { max: 10, timeWindow: '1 minute' });
	app.register(prismaPlugin);
	
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
