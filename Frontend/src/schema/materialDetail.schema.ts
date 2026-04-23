import type { FieldConfig } from "../types/FieldConfig";
import type { MaterialDetailDisplay } from "../types/MaterialDetailType";

export const materialDetailSchema: Record<
  string,
  FieldConfig<MaterialDetailDisplay>
> = {
  ingredient_name: { id: "ingredient_name", label: "Ingredient Name" },
  weight: {
    id: "weight",
    label: "Weight",
  },
  real_percent: {
    id: "real_percent",
    label: "Real Percent",
  },
  note: {
    id: "note",
    label: "Note",
  },
};
