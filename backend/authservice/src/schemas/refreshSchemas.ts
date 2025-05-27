/* Refresh Request Schema */
export const refreshRequestSchema = {
	$id: 'auth.refreshRequest',
	type: 'object',
	required: ['refreshToken'],
	properties: {
		refreshToken: { type: 'string', format: 'uuid' }
	},
	additionalProperties: false
}

/* Refresh Response Schema */
export const refreshResponseSchema = {
	$id: 'auth.refreshResponse',
	$ref: 'auth.loginSuccess' // Reusing the login success schema for consistency
}