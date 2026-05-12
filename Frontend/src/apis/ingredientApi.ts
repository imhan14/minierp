import instance from "./axios";
export interface IngredientFilters {
  id?: number;
  unit?: string;
  search?: string;
  orderBy?: string;
}
export interface UpdateIngredientData {
  ingredient_code?: string;
  ingredient_name?: string;
  unit?: string;
  description?: string;
}

const ingredientApi = {
  getAllIngredients: (params?: IngredientFilters) => {
    return instance.get("/ingredient", { params });
  },
  update: (id: number, data: UpdateIngredientData) => {
    return instance.patch(`/ingredient/${id}`, data);
  },
  createIngredient: (data: UpdateIngredientData) => {
    return instance.post("/ingredient", data);
  },
  deleteIngredient: (id: number) => {
    return instance.delete(`/ingredient/${id}`);
  },
};

export default ingredientApi;
