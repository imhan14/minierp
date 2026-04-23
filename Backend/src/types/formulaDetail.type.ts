export interface FormulaDetailFilters {
  id?: number;
  formula_id?: number;
  ingredient_id?: number;
  standard_quality?: number;
}

export interface CreateFormulaDetailData {
  formula_id: number;
  ingredient_id: number;
  standard_quality: number;
}

export interface UpdateFormulaDetailData {
  formula_id?: number;
  ingredient_id?: number;
  standard_quality?: number;
}
