export default {
	$id: 'auth.tokenVerifyResponse',
	type: 'object',
	description: 'Response schema for internal token verification',
	properties: {
		userId: {
			type: 'number',
			description: 'ID of the user associated with the token'
		},
		username: {
			type: 'string',
			description: 'Username of the user associated with the token'
		}
	},
	required: ['userId', 'username'],
	additionalProperties: false
} as const;
