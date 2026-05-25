import { z } from "zod";

export const zNumber = (message?: string) =>
  z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val),
    z.number(message || "Số không hợp lệ").optional(),
  );

export const zString = (message?: string) =>
  z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : String(val),
    z.string(message || "Chuỗi không hợp lệ").optional(),
  );
