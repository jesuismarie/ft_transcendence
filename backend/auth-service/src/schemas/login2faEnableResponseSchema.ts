const login2faEnableResponseSchema = {
	$id: 'auth.2faEnableResponse',
	type: 'object',
	required: ['otpauthUrl', 'qrSvg'],
	properties: {
		otpauthUrl: { type: 'string', format: 'uri' },
		qrSvg: { type: 'string' }
	},
	additionalProperties: false
}

export default login2faEnableResponseSchema;