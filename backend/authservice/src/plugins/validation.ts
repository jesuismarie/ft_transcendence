import fp from 'fastify-plugin';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { globSync } from 'glob';
import { pathToFileURL } from 'url';
import { dirname, join } from 'path';

export default fp(async (app) => {
	const ajv = new Ajv({
		removeAdditional: 'failing',
	});
	addFormats(ajv);
	
	// Register schemas
	const __dirname = dirname(__filename);
	const schemaDir = join(__dirname, '..', 'schemas');
	for (const tsFile of globSync(`${schemaDir}/*.schema.ts`)) {
		const mod = await import(pathToFileURL(tsFile).href);
		const schema = mod.default ?? mod.Schema;
		ajv.addSchema(schema);
	}
	
	app.setValidatorCompiler(({ schema }) => ajv.compile(schema));
});