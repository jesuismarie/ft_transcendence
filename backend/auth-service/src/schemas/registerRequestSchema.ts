const registerRequestSchema = {
	$id: 'auth.registerRequest',
	type: 'object',
	required: ['email', 'password'],
	properties: {
		email:		{ type: 'string', format: 'email' },
		password:	{ type: 'string', minLength: 8 },
		username:	{ type: 'string', minLength: 2, maxLength: 32, pattern: '^[a-zA-Z0-9_-]+$' }
	},
	additionalProperties: false
}

export default registerRequestSchema;