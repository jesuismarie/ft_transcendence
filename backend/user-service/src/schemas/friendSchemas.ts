export const addFriendSchema = {
    type: 'object',
    required: ['userId', 'friendId'],
    additionalProperties: false,
    properties: {
        userId: { type: 'integer', minimum: 1 },
        friendId: { type: 'integer', minimum: 1 },
    },
} as const;

export const removeFriendSchema = addFriendSchema;

export const listFriendsQuery = {
    type: 'object',
    properties: {
        offset: { type: 'integer', minimum: 0, default: 0 },
        limit:  { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        q:      { type: 'string',  minLength: 1 },
    },
    additionalProperties: false,
} as const;

export const relationshipResponseSchema = {
    type: 'object',
    properties: {
        status: { type: 'boolean', default: false },
    },
    additionalProperties: false,
}