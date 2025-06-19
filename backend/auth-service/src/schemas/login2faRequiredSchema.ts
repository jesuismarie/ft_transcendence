const login2faRequiredSchema = {
	$id: 'auth.2faRequired',
	type: 'object',
	required: ['requires2fa', 'loginTicket'],
	properties: {
		requires2fa: { type: 'boolean' },
		loginTicket: { type: 'string', format: 'uuid' }
	},
	additionalProperties: false
}

export default login2faRequiredSchema;
