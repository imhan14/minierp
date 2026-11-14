export interface FormulaDetailDisplay {
  id: number | string;
  formula_id?: number;
  ingredient_id?: number;
  ingredient_name?: string;
  standard_quality?: number;
  unit?: string;
  isNew?: boolean;
  ingredients?: {
    id?: number;
    ingredient_name?: string;
    unit?: string;
  };
  formulas?: {
    id?: number;
    formula_name?: string;
  };
}
