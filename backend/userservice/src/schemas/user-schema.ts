const emailPattern = "^[^\s@]+@[^\s@]+\.[^\s@]+$";

export const createUserBody = {
  type: 'object',
  required: ['email', 'password', 'displayName', 'name'],
  additionalProperties: false,
  properties: {
    email: { type: 'string', pattern: emailPattern },
    password: { type: 'string', minLength: 8 },
    displayName: { type: 'string', minLength: 3, maxLength: 32 },
    name: { type: 'string', minLength: 3, maxLength: 32 }
  },
} as const;

export const userParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'integer', minimum: 1 },
  },
} as const;
