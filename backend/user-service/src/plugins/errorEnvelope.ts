import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply } from 'fastify';

export default fp(async function errorEnvelope(app: FastifyInstance) {
	app.decorateReply('sendError', function (
		this: FastifyReply,
		err: { statusCode?: number; code?: string; message?: string } | string
	) {
		if (typeof err === 'string') err = { message: err };
		const status = err.statusCode ?? 500;
		const code =
			err.code ??
			(status === 404 ? 'NOT_FOUND' : status === 400 ? 'BAD_REQUEST' : 'INTERNAL_ERROR');
		const message =
			status === 500 && process.env.NODE_ENV === 'production'
				? 'Internal Server Error'
				: err.message ?? 'Error';
		this.code(status).send({ status: 'error', code, message });
	});
	app.setErrorHandler((err, _req, reply: FastifyReply) => {
		reply.sendError(err);
	});
});