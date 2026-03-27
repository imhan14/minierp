import type { ProductionReportType } from "../types/ProductionReportType";
import instance from "./axios";

export interface ProductionReportFilter {
  date?: string;
  team_id?: number;
}

export interface CreateReportPayload {
  team_id: number | null;
  report_date: string;
}
export interface UpdateReportData {
  furnace?: number;
  start_time?: string;
  end_time?: string;
  shift?: string;
}

const productionReportApi = {
  getAllProductionReports: (params?: ProductionReportFilter) => {
    return instance.get<ProductionReportType[]>("/product-report", {
      params: params,
    });
  },
  addProductionReport: (data: CreateReportPayload) => {
    return instance.post<ProductionReportType>("/product-report", data);
  },
  updateProductReport: (id: number | undefined, data: UpdateReportData) => {
    return instance.patch<ProductionReportType>(`/product-report/${id}`, data);
  },
};

export default productionReportApi;
