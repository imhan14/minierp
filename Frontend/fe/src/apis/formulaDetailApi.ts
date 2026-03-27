import type { FormulaDetailType } from "../types/FormulaDetailType";
import instance from "./axios";

const formulaDetailApi = {
  getAllFormulaDetails: (params?: unknown) => {
    return instance.get<FormulaDetailType[]>("/formula-detail", {
      params: params,
    });
  },
};

export default formulaDetailApi;
