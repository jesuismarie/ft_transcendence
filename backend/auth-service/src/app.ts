// Entrypoint for auth-service
// Core Imports
import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import fs from 'fs';

// Plugins
import envPlugin from "./plugins/env";
import jwtPlugin from "./plugins/jwt";
import prismaPlugin from "./plugins/prisma";
import validationPlugin from "./plugins/validation";
import errorEnvelope from "./plugins/errorEnvelope";
import userserviceClient from "./plugins/userserviceClient";
import oauthGoogle from "./plugins/oauth-google";

// Import routes
import healthRoute from "./routes/health";
import registerRoutes from "./routes/register";
import authRoutes from "./routes/auth/routes";
import monitoringRoutes from "./routes/monitoring/routes";


// Build the Fastify server
const buildServer = () => {

  const app = Fastify({
    logger: true,
    https: {
      key: fs.readFileSync(process.env.TLS_CERT_KEY),
      cert: fs.readFileSync(process.env.TLS_CERT_PEM),
    },
  });

  // Register plugins
  app.register(envPlugin);
  app.register(errorEnvelope);
  app.register(validationPlugin);
  app.register(prismaPlugin);
  app.register(jwtPlugin);
  app.register(userserviceClient);
  app.register(oauthGoogle);

  // Security and performance plugins
  app.register(helmet);
  // Rate limiting to prevent abuse
  app.register(rateLimit, {
    max: 200,                     // Limit each IP to 200 requests per minute
    timeWindow: "1 minute",       // Time window for the limit
    ban: 10,                      // Ban IPs after 10 violations
  });

  // Register routes
  app.register(healthRoute);
  app.register(registerRoutes);
  app.register(authRoutes);
  app.register(monitoringRoutes);

  // Handle 404 Not Found
  app.setNotFoundHandler((_req, reply) =>
    reply
      .status(404)
      .send({ status: "error", code: "NOT_FOUND", message: "Route not found" })
  );

  // Global error handler
  app.setErrorHandler((err, _req, reply) => {
    // Hide stack traces in production
    const isProd = process.env.NODE_ENV === "production";
    if (!isProd) app.log.error(err);

    const status = err.statusCode ?? 500;
    reply.status(status).send({
      status: "error",
      code: (err as any).code ?? "INTERNAL",
      message: isProd && status === 500 ? "Internal server error" : err.message,
    });
  });
  return app;
};

// Start the server if launched as a standalone application
if (require.main === module) {
  const server = buildServer();
  server
    .listen({
      port: process.env.PORT ? Number(process.env.PORT) : 3001,
      host: process.env.HOST_NAME ? String(process.env.HOST_NAME) : "localhost",
    })
    .catch((err) => {
      server.log.error(err);
      process.exit(1);
    });
}

// Export the server for testing
export default buildServer;
