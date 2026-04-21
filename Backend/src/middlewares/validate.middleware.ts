import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
export const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((d) => d.message).join(", ");

      const err = Object.assign(new Error(errorMessage), { statusCode: 400 });
      return next(err);
    }

    req.body = value;
    next();
  };
