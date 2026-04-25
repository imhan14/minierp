import { z } from "zod";

export function getFieldConfigs<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  const shape = schema.shape;
  return Object.keys(shape).map((key) => {
    const field = shape[key] as z.ZodTypeAny;
    const meta = field.description ? JSON.parse(field.description) : {};

    return {
      name: key,
      label: meta.label || key,
      type: meta.type || "text",
      tableVisible: meta.tableVisible ?? true,
      formOrder: meta.formOrder ?? 99,
      options: meta.options || [],
      placeholder: meta.placeholder || "",
      zodField: field,
    };
  });
}
