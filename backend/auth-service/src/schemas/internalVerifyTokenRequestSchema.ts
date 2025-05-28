export default {
	$id: 'auth.tokenVerifyRequest',
	type: 'object',
	description: 'Request schema for internal token verification',
  	properties: {
	token: {
	  type: 'string',
	  description: 'JWT token to verify'
	}
  	},
  required: ['token'],
  additionalProperties: false
} as const;