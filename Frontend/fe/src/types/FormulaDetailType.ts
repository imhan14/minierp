import type { FormulaType } from "./FormulaType";
import type { IngredientType } from "./IngredientType";

export interface FormulaDetailDisplay extends Omit<
  FormulaDetailType,
  "ingredients" | "formulas"
> {
  formula_id?: number;
  formula_name?: string;
  ingredient_name: string;
  ingredient_id?: number;
  unit: string;
}
export interface FormulaDetailType {
  id: number | string;
  formulas: FormulaType;
  ingredients: IngredientType;
  standard_quality: number;
  isNew?: boolean;
}
