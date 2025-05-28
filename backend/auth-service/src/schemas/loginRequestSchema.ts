// Schema to validate login requests
const loginRequestSchema = {
	$id: 'auth.loginRequest',
	type: 'object',
	required: ['username', 'password'],
	properties: {
		username: {type: 'string', pattern: '^[a-zA-Z0-9_-]+$'}, // Only alphanumeric characters, underscore and hyphen
		password: {type: 'string', minLength: 8}
	},
	additionalProperties: false
}

export default loginRequestSchema;