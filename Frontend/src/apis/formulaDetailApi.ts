import instance from "./axios";

export interface FormulaFilters {
  id?: number;
  formula_id?: number;
}
export interface FormulaDetailData {
  ingredient_id?: number;
  standard_quality?: number;
}
const formulaDetailApi = {
  getAllFormulaDetails: (params?: FormulaFilters) => {
    return instance.get("/formula-detail", {
      params,
    });
  },
  updateFormulaDetail: (id: number, data: FormulaDetailData) => {
    return instance.patch(`/formula-detail/${id}`, data);
  },
  createFormulaDetail: (data: FormulaDetailData) => {
    return instance.post(`/formula-detail`, data);
  },
  deleteFormulaDetail: (id: number) => {
    return instance.delete(`/formula-detail/${id}`);
  },
};

export default formulaDetailApi;
