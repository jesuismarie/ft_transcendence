// Schema to validate login requests
const loginRequestSchema = {
	$id: 'auth.loginRequest',
	type: 'object',
	required: ['username', 'password'],
	properties: {
		email: {type: 'string', format: 'email' }, // Only alphanumeric characters, underscore and hyphen
		password: {type: 'string', minLength: 8}
	},
	additionalProperties: false
}

export default loginRequestSchema;