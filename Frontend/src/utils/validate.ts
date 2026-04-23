import Joi from "joi";
export const validatePayload = <T>(schema: Joi.ObjectSchema<T>, data: T) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
    convert: true,
  });
  if (error) {
    return { isValid: false, message: error.details[0].message };
  }
  return { isValid: true, data: value };
};
