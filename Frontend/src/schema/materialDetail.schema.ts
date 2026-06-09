import { z } from "zod";
import { IngredientSchema } from "./ingredient.schema";

export const MaterialDetailSchema = z.object({
  id: z.number(),
  material_id: z.number(),
  ingredients: IngredientSchema.pick({}).optional(),
  ingredient_id: z.number(),
  ingredient_name: z.string().optional(),
  weight: z.number().nullable().optional(),
  real_percent: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const CreateMaterialDetailSchema = z.object({
  material_id: z.number(),
  ingredient_id: z.number({ message: "Vui lòng chọn nguyên liệu" }),
  weight: z.number().optional(),
  real_percent: z.number().optional(),
  note: z.string().optional(),
});

export const UpdateMaterialDetailSchema = z.object({
  weight: z.number().optional(),
  real_percent: z.number().optional(),
  note: z.string().optional(),
});

export type MaterialDetailType = z.infer<typeof MaterialDetailSchema>;
export type CreateMaterialDetailPayload = z.infer<
  typeof CreateMaterialDetailSchema
>;
export type UpdateMaterialDetailPayload = z.infer<
  typeof UpdateMaterialDetailSchema
>;
