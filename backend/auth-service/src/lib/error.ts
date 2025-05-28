import { FastifyError } from 'fastify';
import { CommonTypes } from '@KarenDanielyan/ft-transcendence-api-types';

export function apiError(code: string, message: string, status = 400): FastifyError {
	const err = new Error(message) as CommonTypes.ApiError & FastifyError;
	err.statusCode = status;
	err.code = code;
	err.message = message;
	return err;
}