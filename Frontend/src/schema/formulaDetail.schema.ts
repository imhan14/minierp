import type { FormulaDetailDisplay } from "@/types/FormulaDetailType";
import type { FieldConfig } from "../types/FieldConfig";

export const formulaDetailSchema: Record<
  string,
  FieldConfig<FormulaDetailDisplay>
> = {
  id: { id: "id", label: "ID", isReadOnly: true },
  ingredient_name: { id: "ingredient_name", label: "Ingredient Name" },
  ingredient_id: {
    id: "ingredient_id",
    label: "Ingredient Id",
  },
  formula_id: {
    id: "formula_id",
    label: "Formula Id",
  },
  formula_name: {
    id: "formula_name",
    label: "Formula Name",
  },
  standard_quality: {
    id: "standard_quality",
    label: "Standard Quality",
  },
  unit: {
    id: "unit",
    label: "Unit",
  },
};
