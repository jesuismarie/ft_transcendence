/* Logout Request Schema */
export const logoutRequestSchema = {
	$id: 'auth.logoutRequest',
	type: 'object',
	required: ['refreshToken'],
	properties: {
		refreshToken: { type: 'string' }
	},
	additionalProperties: false
}

/* Logout Response Schema */
export const logoutResponseSchema = {
	$id: 'auth.logoutResponse',
	type: 'object',
	required: ['revoked'],
	properties: {
		revoked: { const: true }
	},
	additionalProperties: false
}