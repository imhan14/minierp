import type { FieldConfig } from "../types/FieldConfig";
import type { ExtraMaterialsJson } from "../types/MaterialReportType";

export const ExtraMaterialsJsonSchema: Record<
  string,
  FieldConfig<ExtraMaterialsJson>
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
