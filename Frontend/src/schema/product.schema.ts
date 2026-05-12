import { z } from "zod";

export type FieldType = "text" | "number" | "select" | "date" | "price";

export const ProductSchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .min(3, "Tên phải ít nhất 3 ký tự")
    .describe(
      JSON.stringify({
        label: "Tên sản phẩm",
        type: "text",
        tableVisible: true,
        formOrder: 1,
      }),
    ),

  price: z
    .number()
    .positive("Giá phải lớn hơn 0")
    .describe(
      JSON.stringify({
        label: "Giá bán",
        type: "price",
        tableVisible: true,
        formOrder: 2,
      }),
    ),

  category: z.enum(["Electronics", "Furniture", "Food"]).describe(
    JSON.stringify({
      label: "Danh mục",
      type: "select",
      options: ["Electronics", "Furniture", "Food"],
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
        tableVisible: false,
        formOrder: 4,
      }),
    ),
});

export type Product = z.infer<typeof ProductSchema>;
