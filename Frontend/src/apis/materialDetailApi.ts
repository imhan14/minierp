import type { MaterialDetailType } from "../types/MaterialDetailType";
import instance from "./axios";
export interface MaterialDetailFilter {
  material_id?: number | undefined;
}
export interface MaterialDetailData {
  id?: number;
  material_id?: number;
  ingredient_id?: number;
  weight?: number;
  real_percent?: number;
  note?: string;
}
const mateiralDetailApi = {
  getAllMaterialDetails: (filters: MaterialDetailFilter) => {
    return instance.get<MaterialDetailType[]>("/material-detail", {
      params: filters,
    });
  },
  createMateiralDetail: (data?: MaterialDetailData) => {
    return instance.post("/material-detail", data);
  },
  updateMaterialDetail: (id?: number, data?: MaterialDetailData) => {
    return instance.patch(`/material-detail/${id}`, data);
  },
};

export default mateiralDetailApi;
