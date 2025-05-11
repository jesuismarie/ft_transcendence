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
    additionalProperties: false,
    properties: {
        displayName: { type: 'string', minLength: 1 },
        email:       { type: 'string', format: 'email' },
    },
    // at least one property must be supplied
    minProperties: 1
} as const;

export const updatePasswordSchema = {
    type: 'object',
    required: ['oldPassword', 'newPassword'],
    additionalProperties: false,
    properties: {
        oldPassword: { type: 'string', minLength: 8 },
        newPassword: { type: 'string', minLength: 8 },
    }
}

export const listUsersQuery = {
    type: 'object',
    properties: {
        offset: { type: 'number', minimum: 0, default: 0 },
        limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
        q: { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
}