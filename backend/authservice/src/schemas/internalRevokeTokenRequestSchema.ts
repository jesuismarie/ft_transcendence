/**
 * Schema for POST /internal/tokens/revoke
 */
export default {
	$id: 'auth.internalRevokeTokenRequest',
	type: 'object',
	required: ['tokenId'],
	properties: {
		tokenId: { type: 'string', minLength: 8 }   // loosen if using uuid
	},
	additionalProperties: false
} as const;
