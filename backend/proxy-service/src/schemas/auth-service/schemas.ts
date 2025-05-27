export const loginRequestSchema = {
  $id: "auth.loginRequest",
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", pattern: "^[a-zA-Z0-9_-]+$" },
    password: { type: "string", minLength: 8 },
  },
  additionalProperties: false,
};

export const loginSuccessSchema = {
  $id: "auth.loginSuccess",
  type: "object",
  required: ["accessToken", "refreshToken", "userId"],
  properties: {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    userId: { type: "integer", minimum: 1 },
  },
  additionalProperties: false,
};

export const registerRequestSchema = {
  $id: "auth.registerRequest",
  type: "object",
  required: ["email", "username", "password"],
  properties: {
    email: { type: "string", format: "email" },
    username: { type: "string", pattern: "^[a-zA-Z0-9_-]+$" },
    password: { type: "string", minLength: 8 },
  },
  additionalProperties: false,
};

export const registerResponseSchema = {
  $id: "auth.registerResponse",
  type: "object",
  required: ["accessToken", "refreshToken", "userId"],
  properties: {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    userId: { type: "integer", minimum: 1 },
  },
  additionalProperties: false,
};

export const logoutRequestSchema = {
  $id: "auth.logoutRequest",
  type: "object",
  required: ["refreshToken"],
  properties: {
    refreshToken: { type: "string" },
  },
  additionalProperties: false,
};

export const logoutResponseSchema = {
  $id: "auth.logoutResponse",
  type: "object",
  required: ["revoked"],
  properties: {
    revoked: { type: "boolean", const: true },
  },
  additionalProperties: false,
};

export const refreshRequestSchema = {
  $id: "auth.refreshRequest",
  type: "object",
  required: ["refreshToken"],
  properties: {
    refreshToken: { type: "string" },
  },
  additionalProperties: false,
};

export const refreshResponseSchema = {
  $id: "auth.refreshResponse",
  type: "object",
  required: ["accessToken", "refreshToken", "userId"],
  properties: {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    userId: { type: "integer", minimum: 1 },
  },
  additionalProperties: false,
};

export const login2faRequestSchema = {
  $id: "auth.login2faRequest",
  type: "object",
  required: ["loginTicket", "otp"],
  properties: {
    loginTicket: { type: "string", format: "uuid" },
    otp: { type: "string", pattern: "^[0-9]{6}$" },
  },
  additionalProperties: false,
};

export const enable2faResponseSchema = {
  $id: "auth.2faEnableResponse",
  type: "object",
  required: ["otpauthUrl", "qrSvg"],
  properties: {
    otpauthUrl: { type: "string", format: "uri" },
    qrSvg: { type: "string" },
  },
  additionalProperties: false,
};

export const verify2faRequestSchema = {
  $id: "auth.2faVerifyRequest",
  type: "object",
  required: ["otp"],
  properties: {
    otp: { type: "string", pattern: "^[0-9]{6}$" },
  },
  additionalProperties: false,
};

export const verify2faResponseSchema = {
  $id: "auth.2faVerifyResponse",
  type: "object",
  required: ["verified"],
  properties: {
    verified: { type: "boolean", const: true },
  },
  additionalProperties: false,
};

export const internalVerifyTokenRequestSchema = {
  $id: "auth.tokenVerifyRequest",
  type: "object",
  required: ["token"],
  properties: {
    token: { type: "string" },
  },
  additionalProperties: false,
};

export const internalVerifyTokenResponseSchema = {
  $id: "auth.tokenVerifyResponse",
  type: "object",
  required: ["userId", "username"],
  properties: {
    userId: { type: "integer", minimum: 1 },
    username: { type: "string" },
  },
  additionalProperties: false,
};
