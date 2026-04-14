import type { FormulaType } from "@/types/FormulaType";
import instance from "./axios";

export interface FormulaFilters {
  id?: number;
  startDate?: string;
  endDate?: string;
  date?: string;
}

const formulaApi = {
  getAllFormula: (params?: FormulaFilters) => {
    return instance.get<FormulaType[]>("/formula", { params });
  },
};

export default formulaApi;
