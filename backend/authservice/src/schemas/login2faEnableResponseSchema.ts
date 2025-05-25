export const login2faEnableResponseSchema = {
	$id: 'auth.login2faEnableResponse',
	type: 'object',
	required: ['otpauthUrl', 'qrSvg'],
	properties: {
		otpauthUrl: { type: 'string', format: 'uri' },
		qrSvg: { type: 'string' }
	},
	additionalProperties: false
}
