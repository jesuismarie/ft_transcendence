import {FastifyInstance} from "fastify";
import Ajv from 'ajv';
import fp from 'fastify-plugin';
import addFormats from 'ajv-formats';

import errorSchema from "../schemas/errorSchema";
import loginRequestSchema from "../schemas/loginRequestSchema";
import loginSuccessSchema from "../schemas/loginSuccessSchema";
import registerRequestSchema from "../schemas/registerRequestSchema";
import registerResponseSchema from "../schemas/registerResponseSchema";


// Helper to add schemas to both Ajv and Fastify
function addSchema(app: FastifyInstance, ajv: Ajv, schema: any) {
	app.addSchema(schema);
	ajv.addSchema(schema);
}

export default fp(async (app) => {
	const ajv = new Ajv({
		removeAdditional: 'failing',
	});
	addFormats(ajv);
	
	// TODO: add schemas on demand
	addSchema(app, ajv, errorSchema);
	addSchema(app, ajv, loginRequestSchema);
	addSchema(app, ajv, loginSuccessSchema);
	addSchema(app, ajv, registerRequestSchema);
	addSchema(app, ajv, registerResponseSchema);
	
	app.setValidatorCompiler(({ schema }) => ajv.compile(schema));
});