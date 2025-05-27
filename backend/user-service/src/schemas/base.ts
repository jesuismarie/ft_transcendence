import Ajv from 'ajv';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  removeAdditional: 'all',
});
