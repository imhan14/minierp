import type { FormulaType } from "@/types/FormulaType";
import instance from "./axios";

export interface FormulaFilters {
  id?: number;
  search?: string;
  active?: boolean | string;
  line?: string;
  specification?: string;
  color?: string;
  typeOfSpecification?: string;
  orderBy?: string;
}
export interface FormulaData {
  formula_code?: number;
  formula_name?: string;
  product_id?: number;
  is_active?: boolean | string;
  product_line?: string;
  specification?: string;
  color?: string;
  type_of_specification?: string;
}

const formulaApi = {
  getAllFormula: (params?: FormulaFilters) => {
    return instance.get<FormulaType[]>("/formula", { params });
  },
  createFormula: (data?: FormulaData) => {
    return instance.post<FormulaType>("/formula", data);
  },
  updateFormula: (id: number, data?: FormulaData) => {
    return instance.patch(`/formula/${id}`, data);
  },
};

export default formulaApi;
