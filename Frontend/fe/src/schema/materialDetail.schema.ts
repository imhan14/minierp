import type { FieldConfig } from "../types/FieldConfig";
import type { MaterialDetailType } from "../types/MaterialDetailType";
export interface MaterialDetailDisplay extends Omit<
  MaterialDetailType,
  "ingredients"
> {
  ingredient_name: string;
}
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
