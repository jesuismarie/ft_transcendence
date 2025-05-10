export const addFriendSchema = {
    type: 'object',
    required: ['userId', 'friendId'],
    additionalProperties: false,
    properties: {
        userId: { type: 'integer', minimum: 1 },
        friendId: { type: 'integer', minimum: 1 },
    },
} as const;