export interface IngredientFilters {
  id?: number;
  search?: string;
}

export interface CreateIngredientData {
  ingredient_code: string;
  ingredient_name: string;
  unit: string;
  description?: string;
}

export interface UpdateIngredientData {
  ingredient_code?: string;
  ingredient_name?: string;
  unit?: string;
  description?: string;
}
