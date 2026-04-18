import type { FormulaDetailType } from "../types/FormulaDetailType";
import instance from "./axios";

export interface FormulaDetailData {
  formula_id?: number;
  ingredient_id?: number;
  standard_quality?: number;
}
const formulaDetailApi = {
  getAllFormulaDetails: (params?: unknown) => {
    return instance.get<FormulaDetailType[]>("/formula-detail", {
      params: params,
    });
  },
  updateFormulaDetail: (id: number, data: FormulaDetailData) => {
    return instance.patch(`/formula-detail/${id}`, data);
  },
  createFormulaDetail: (data: FormulaDetailData) => {
    return instance.post(`/formula-detail`, data);
  },
};

export default formulaDetailApi;
