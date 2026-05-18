// import type { FormulaType } from "@/types/FormulaType";
import type { FormulaType } from "@/schema/formula.schema";
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
  getAllFormula: async (params?: FormulaFilters) => {
    const res = await instance.get<FormulaType[]>("/formula", { params });
    return {
      ...res,
      data: res.data.map((item: FormulaType) => ({
        ...item,
        product_id: item.products?.id,
        product_name: item.products?.product_name,
      })),
    };
  },
  createFormula: (data?: FormulaData) => {
    return instance.post<FormulaType>("/formula", data);
  },
  updateFormula: (id: number, data?: FormulaData) => {
    return instance.patch(`/formula/${id}`, data);
  },
  deleteFormula: (id: number) => {
    return instance.delete(`/formula/${id}`);
  },
};

export default formulaApi;
