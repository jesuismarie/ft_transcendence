import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

export default fp(async (app: FastifyInstance) => {
	const prisma = new PrismaClient();
	await prisma.$connect();
	
	app.decorate('prisma', prisma);
	
	app.addHook('onClose', async () => {
		await prisma.$disconnect();
	});
});

declare module 'fastify' {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}
