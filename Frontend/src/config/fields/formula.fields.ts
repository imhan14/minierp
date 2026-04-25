// config/fields/formula.fields.ts
import type { FieldConfig } from "@/types/FieldConfig";
import type { FormulaDisplay } from "@/types/FormulaType";

export const formulaFields: FieldConfig<FormulaDisplay>[] = [
  { key: "id", label: "Tên công thức", type: "text", required: true },
  { key: "product_id", label: "Sản phẩm", type: "select", required: true },
  { key: "is_active", label: "Trạng thái", type: "textarea" },
  {
    key: "product_line",
    label: "Dây chuyền",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
    ],
    editRoles: ["admin", "manager"],
  },
];
