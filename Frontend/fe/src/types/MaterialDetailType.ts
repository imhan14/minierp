import type { MaterialReportType } from "./MaterialReportType";
import type { IngredientType } from "./IngredientType";
export interface MaterialDetailType {
  id: number;
  material_reports: MaterialReportType;
  ingredients: IngredientType;
  weight: number;
  real_percent: number;
  note: string;
}
