import { FastifyInstance } from "fastify";
import Ajv from 'ajv';
import fp from 'fastify-plugin';
import addFormats from 'ajv-formats';

import errorSchema from "../schemas/errorSchema";
import loginRequestSchema from "../schemas/loginRequestSchema";
import loginSuccessSchema from "../schemas/loginSuccessSchema";
import registerRequestSchema from "../schemas/registerRequestSchema";
import registerResponseSchema from "../schemas/registerResponseSchema";
import login2faRequiredSchema from "../schemas/login2faRequiredSchema";
import login2faVerifyRequestSchema from "../schemas/login2faVerifyRequestSchema";
import login2faRequestSchema from "../schemas/login2faRequestSchema";
import login2faEnableResponseSchema from "../schemas/login2faEnableResponseSchema";
import {logoutRequestSchema, logoutResponseSchema} from "../schemas/logoutSchemas";
import {refreshRequestSchema, refreshResponseSchema} from "../schemas/refreshSchemas";
import internalRevokeTokenRequestSchema from "../schemas/internalRevokeTokenRequestSchema";
import login2faVerifyResponseSchema from "../schemas/login2faVerifyResponseSchema";
import internalVerifyTokenRequestSchema from "../schemas/internalVerifyTokenRequestSchema";
import internalVerifyTokenResponseSchema from "../schemas/internalVerifyTokenResponseSchema";


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
	addSchema(app, ajv, login2faRequiredSchema);
	addSchema(app, ajv, login2faVerifyRequestSchema);
	addSchema(app, ajv, login2faRequestSchema);
	addSchema(app, ajv, login2faEnableResponseSchema);
	addSchema(app, ajv, logoutRequestSchema);
	addSchema(app, ajv, logoutResponseSchema);
	addSchema(app, ajv, refreshRequestSchema);
	addSchema(app, ajv, refreshResponseSchema);
	addSchema(app, ajv, internalRevokeTokenRequestSchema);
	addSchema(app, ajv, login2faVerifyResponseSchema);
	addSchema(app, ajv, internalVerifyTokenRequestSchema);
	addSchema(app, ajv, internalVerifyTokenResponseSchema);
	app.setValidatorCompiler(({ schema }) => ajv.compile(schema));
});