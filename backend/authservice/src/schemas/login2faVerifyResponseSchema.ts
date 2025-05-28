/**
 * Response for POST /auth/2fa/verify
 * Returns a simple confirmation object.
 */
export default {
	$id: 'auth.2faVerifyResponse',
	type: 'object',
	required: ['verified'],
	properties: {
		verified: { const: true }
	},
	additionalProperties: false
} as const;