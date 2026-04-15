import type { FormulaDisplay } from "@/types/FormulaType";
import type { FieldConfig } from "../types/FieldConfig";

export const formulaSchema: Record<string, FieldConfig<FormulaDisplay>> = {
  id: { id: "id", label: "ID" },
  formula_code: { id: "formula_code", label: "Formula Code" },
  formula_name: { id: "formula_name", label: "Formula Name" },
  product_id: { id: "product_id", label: "Product ID" },
  product_name: { id: "product_name", label: "Product Name" },
  is_active: { id: "is_active", label: "Is Active" },
  product_line: { id: "product_line", label: "Product Line" },
  specification: { id: "specification", label: "Specification" },
  color: { id: "color", label: "Color" },
  type_of_specification: {
    id: "type_of_specification",
    label: "Type Of Specification",
  },
  created_by: { id: "created_by", label: "Created By" },
};
