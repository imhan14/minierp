import type { MaterialDetailType } from "../types/MaterialDetailType";
import instance from "./axios";
export interface MaterialDetailFilter {
  material_id?: number | null | undefined;
}
export interface MaterialDetailData {
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
  updateMaterialDetail: (id?: number, data?: MaterialDetailData) => {
    return instance.patch(`/material-detail/${id}`, data);
  },
};

export default mateiralDetailApi;
