import type { IngredientType } from "./IngredientType";

export interface FormulaDetailDisplay extends Omit<
  FormulaDetailType,
  "ingredients"
> {
  ingredient_name: string;
  unit: string;
}
export interface FormulaDetailType {
  id: number;
  formula_id: number;
  ingredients: IngredientType;
  standard_quality: number;
}
