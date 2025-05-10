export const createUserSchema = {
    type: 'object',
    required: ['email', 'password', 'displayName'],
    additionalProperties: false,
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        displayName: { type: 'string', minLength: 1 },
    },
} as const;

export const updateUserSchema = {
    type: 'object',
    required: ['displayName'],
    additionalProperties: false,
    properties: {
        displayName: { type: 'string', minLength: 1 },
    },
} as const;