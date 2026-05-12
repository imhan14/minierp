import Joi from "joi";
import type { ZodSchema } from "zod";

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

export const validateWithZod = <T>(schema: ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message;
    return {
      isValid: false,
      message: firstError,
    };
  }

  return {
    isValid: true,
    data: result.data,
  };
};
