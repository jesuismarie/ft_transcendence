export const errorSchema = {
  type: "object",
  required: ["code", "message"],
  properties: {
    status: { type: "string" },
    code: { type: "string" },
    message: { type: "string" },
  },
  additionalProperties: false,
};

export default errorSchema;
