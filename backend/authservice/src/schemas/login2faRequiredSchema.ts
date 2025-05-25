const login2faRequiredSchema = {
	$id: 'auth.login2faRequired',
	type: 'object',
	required: ['requires2fa', 'loginTicket'],
	properties: {
		requires2fa: { const: true },
		loginTicket: { type: 'string', format: 'uuid' }
	},
	additionalProperties: false
}

export default login2faRequiredSchema;
