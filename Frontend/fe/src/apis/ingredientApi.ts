import instance from "./axios";
export interface FiltersProps {
  id?: number;
}

const ingredientApi = {
  getAllIngredients: (filters?: FiltersProps) => {
    return instance.get("/ingredient", { params: filters });
  },
};

export default ingredientApi;
