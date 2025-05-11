import fastifyJwt from '@fastify/jwt';

// Register the Fastify JWT plugin
export default async function (fastify, options) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',  // Make sure to keep your secret safe using env vars
    sign: {
      expiresIn: '1h',  // Tokens will expire in 1 hour
    }
  });

  // TODO: Optionally create an 'authenticate' decorator to handle user auth
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify(); // Verify the JWT token from the request
    } catch (err) {
      reply.send(err);  // If the token is invalid, send the error back
    }
  });
}
