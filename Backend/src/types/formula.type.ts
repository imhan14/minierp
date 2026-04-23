export interface FormulaFilters {
  id?: number;
  search?: string;
  active?: boolean;
  line?: string;
  specification?: string;
  color?: string;
  typeOfSpecification?: string;
  orderBy?: string;
}

export interface CreateFormulaData {}

export interface UpdateFormulaData {
  formula_name?: string;
  product_id?: number;
  is_active?: boolean;
  product_line?: string;
  specification?: string;
  color?: string;
  type_of_specification?: string;
}
