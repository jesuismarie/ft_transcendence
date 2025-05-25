const login2faVerifyRequestSchema = {
	$id: 'auth.login2faVerifyRequest',
	type: 'object',
	required: ['otp'],
	properties: {
		otp: { type: 'string', pattern: '^[0-9]{6}$' }
	},
	additionalProperties: false
}

export default login2faVerifyRequestSchema;