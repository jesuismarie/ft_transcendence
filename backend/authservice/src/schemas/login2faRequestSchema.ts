const login2faRequestSchema = {
	$id: 'auth.login2faRequest',
	type: 'object',
	required: ['loginTicket', 'otp'],
	properties: {
	loginTicket: { type: 'string', format: 'uuid' },
	otp: { type: 'string', pattern: '^[0-9]{6}$' }
  },
  additionalProperties: false
}

export default login2faRequestSchema;