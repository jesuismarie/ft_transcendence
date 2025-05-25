// AuthService entry point

// Core Imports
import Fastify, {FastifyInstance} from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

// Plugins
import envPlugin from './plugins/env';
import jwtPlugin from './plugins/jwt';
import prismaPlugin from './plugins/prisma';
import validationPlugin from './plugins/validation';
import errorEnvelope from "./plugins/errorEnvelope";
import userserviceClient from "./plugins/userserviceClient";

// Import routes
import healthRoute from './routes/health';
import registerRoutes from "./routes/register";

// Build the Fastify server
const buildServer = () => {
	const app:FastifyInstance = Fastify({ logger: true });
	
	app.register(envPlugin);
	app.register(errorEnvelope);
	app.register(validationPlugin);
	app.register(prismaPlugin);
	app.register(jwtPlugin);
	app.register(userserviceClient);
	app.register(helmet);
	app.register(rateLimit, { max: 10, timeWindow: '1 minute' });
	
	// Register routes
	app.register(healthRoute);
	app.register(registerRoutes);
	
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
