import { z } from "zod";

export type FieldType = "text" | "number" | "select" | "date" | "price";

export const ProductSchema = z.object({
  id: z.number().optional(),

  product_code: z
    .string()
    .min(3, "Code ít nhất 3 ký tự")
    .describe(
      JSON.stringify({
        label: "Code",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),

  product_name: z
    .string()
    .min(3, "Tên phải ít nhất 3 ký tự")
    .describe(
      JSON.stringify({
        label: "Tên sản phẩm",
        type: "text",
        tableVisible: true,
        formOrder: 2,
      }),
    ),

  unit: z
    .enum(["Kg", "Met", "Cai", "Lit"], "Đơn vị tính không hợp lệ")
    .describe(
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
        label: "Mô tả",
        type: "text",
        tableVisible: true,
        formOrder: 4,
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
});
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  created_at: true,
});

export const UpdateProductSchema = ProductSchema.partial().pick({
  product_code: true,
  product_name: true,
  unit: true,
  description: true,
});

export const DeleteProductSchema = z.object({
  id: z.number(),
  reason: z.string().min(5, "Cần nhập lý do xóa ít nhất 5 ký tự"),
});
export type ProductType = z.infer<typeof ProductSchema>;
export type ProductCreatePayload = z.infer<typeof CreateProductSchema>;
export type ProductUpdatePayload = z.infer<typeof UpdateProductSchema>;
