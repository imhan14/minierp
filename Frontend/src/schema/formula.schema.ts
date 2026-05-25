import { z } from "zod";

export const FormulaSchema = z.object({
  id: z.number().optional(),

  formula_code: z.number().describe(
    JSON.stringify({
      label: "Mã công thức",
      type: "text",
      tableVisible: true,
      formOrder: 1,
      // placeholder: "VD: NPL001",
    }),
  ),

  formula_name: z
    .string()
    .min(3, "Tên công thức phải từ 3 ký tự")
    .describe(
      JSON.stringify({
        label: "Tên công thức",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),
  products: z
    .object({
      id: z.number(),
      product_name: z.string(),
    })
    .optional(),
  product_id: z
    .number("Vui lòng chọn sản phẩm")
    .optional()
    .describe(
      JSON.stringify({
        label: "Mã sản phẩm",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
  product_name: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Tên sản phẩm",
        type: "text",
        tableVisible: true,
        formOrder: 3,
      }),
    ),
  is_active: z
    .preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return val;
    }, z.boolean("Trạng thái không hợp lệ"))
    .default(true)
    .describe(
      JSON.stringify({
        label: "Trạng thái",
        type: "select",
        tableVisible: true,
        formOrder: 4,
      }),
    ),

  product_line: z
    .enum(["tron", "sangbao", "mothat"], "Dây chuyền sản xuất không hợp lệ")
    .describe(
      JSON.stringify({
        label: "Dây chuyền",
        type: "select",
        tableVisible: true,
        formOrder: 5,
      }),
    ),
  specification: z.enum(["btp"], "Quy cách không hợp lệ").describe(
    JSON.stringify({
      label: "Quy cách",
      type: "select",
      tableVisible: true,
      formOrder: 6,
    }),
  ),
  color: z.enum(["bamau", "xam"], "Màu không hợp lệ").describe(
    JSON.stringify({
      label: "Màu",
      type: "select",
      tableVisible: true,
      formOrder: 7,
    }),
  ),
  type_of_specification: z
    .enum(["50Kg", "25Kg"], "Quy cách đóng gói không hợp lệ")
    .describe(
      JSON.stringify({
        label: "Đóng gói",
        type: "select",
        tableVisible: true,
        formOrder: 8,
      }),
    ),
  created_at: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Ngày tạo",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),

  created_by: z
    .string()
    .optional()
    .describe(
      JSON.stringify({
        label: "Người tạo",
        type: "text",
        tableVisible: false,
        formOrder: false,
      }),
    ),
});

export const CreateFormulaSchema = FormulaSchema.omit({
  id: true,
  formula_code: true,
  product_name: true,
  products: true,
  created_at: true,
  created_by: true,
}).extend({
  product_id: z.number({ message: "Vui lòng chọn sản phẩm" }),
});

export const UpdateFormulaSchema = FormulaSchema.partial();

export const DeleteFormulaSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});

export type FormulaType = z.infer<typeof FormulaSchema>;
export type FormulaCreatePayload = z.infer<typeof CreateFormulaSchema>;
export type FormulaUpdatePayload = z.infer<typeof UpdateFormulaSchema>;
