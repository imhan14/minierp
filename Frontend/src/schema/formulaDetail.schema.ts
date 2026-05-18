import z from "zod";
import { IngredientSchema } from "./ingredient.schema";
import { FormulaSchema } from "./formula.schema";

export const FormulaDetailSchema = z.object({
  id: z.number().optional(),

  ingredients: IngredientSchema.pick({
    id: true,
    ingredient_name: true,
    unit: true,
  }).optional(),
  formulas: FormulaSchema.pick({
    id: true,
    formula_name: true,
  }).optional(),
  ingredient_id: z
    .number("Vui lòng chọn nguyên liệu")
    .optional()
    .describe(
      JSON.stringify({
        label: "Mã nguyên liệu",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  ingredient_name: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Tên nguyên liệu",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),
  formula_id: z
    .number("Vui lòng chọn công thức")
    .optional()
    .describe(
      JSON.stringify({
        label: "Mã công thức",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  unit: IngredientSchema.shape.unit.optional().describe(
    JSON.stringify({
      label: "Đơn vị tính",
      type: "select",
      tableVisible: true,
      formOrder: 3,
    }),
  ),
  formula_name: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Tên công thức",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),

  standard_quality: z
    .number("Số không hợp lệ")
    .min(0.0001, "Số lượng phải lớn hơn 0")
    .optional()
    .describe(
      JSON.stringify({
        label: "số lượng",
        type: "text",
        tableVisible: true,
        formOrder: 4,
      }),
    ),
});
export const CreateFormulaDetailSchema = FormulaDetailSchema.omit({
  id: true,
  ingredient_name: true,
  ingredients: true,
  unit: true,
  formula_name: true,
  formulas: true,
}).extend({
  ingredient_id: z.number({ message: "Vui lòng chọn nguyên liệu" }),
});

export const UpdateFormulaDetailSchema = FormulaDetailSchema.pick({
  ingredient_id: true,
  formula_id: true,
  standard_quality: true,
});

export const DeleteFormulaDetailSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type FormulaDetailType = z.infer<typeof FormulaDetailSchema>;
export type FormulaDetailCreatePayload = z.infer<
  typeof CreateFormulaDetailSchema
>;
export type FormulaDetailUpdatePayload = z.infer<
  typeof UpdateFormulaDetailSchema
>;
