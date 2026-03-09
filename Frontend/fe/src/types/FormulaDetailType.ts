import type { IngredientType } from "./IngredientType";
export interface FormulaDetailType {
  id: number;
  formula_id: number;
  ingredients: IngredientType;
  standard_quality: number;
}
