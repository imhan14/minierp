import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.number().optional(),

  ingredient_code: z
    .string()
    .min(2, "Mã nguyên liệu quá ngắn")
    .describe(
      JSON.stringify({
        label: "Mã nguyên liệu",
        type: "text",
        tableVisible: true,
        formOrder: 1,
        placeholder: "VD: NPL001",
      }),
    ),

  ingredient_name: z
    .string()
    .min(3, "Tên nguyên liệu phải từ 3 ký tự")
    .describe(
      JSON.stringify({
        label: "Tên nguyên liệu",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),

  unit: z.enum(["Kg", "Met", "Cai", "Lit"]).describe(
    JSON.stringify({
      label: "Đơn vị tính",
      type: "select",
      options: [
        { label: "Kg", value: "Kg" },
        { label: "Met", value: "Met" },
        { label: "Cái", value: "Cai" },
        { label: "Lít", value: "Lit" },
      ],
      tableVisible: true,
      formOrder: 3,
    }),
  ),

  description: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Ghi chú",
        type: "textarea",
        tableVisible: false,
        formOrder: 6,
      }),
    ),
});

export const CreateIngredientSchema = IngredientSchema.omit({ id: true });

export const UpdateIngredientSchema = IngredientSchema.partial();

export const DeleteIngredientSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type IngredientType = z.infer<typeof IngredientSchema>;
export type IngredientCreatePayload = z.infer<typeof CreateIngredientSchema>;
export type IngredientUpdatePayload = z.infer<typeof UpdateIngredientSchema>;
