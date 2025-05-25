const loginSuccessSchema = {
	$id: 'auth.loginSuccess',
	type: 'object',
	required: ['accessToken', 'refreshToken', 'userId'],
	properties: {
		accessToken:  { type: 'string' },
		// The refresh token is used to get a new access token when the current one expires
		refreshToken: { type: 'string' },
		userId:       { type: 'integer', minimum: 1 } // User ID must be a positive integer
	},
	additionalProperties: false
}

export default loginSuccessSchema;