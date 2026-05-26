import type { ProductionReportType } from "@/schema/productionReport.schema";
import instance from "./axios";

export interface ProductionReportFilter {
  date?: string;
  team_id?: number;
  startDate?: string;
  endDate?: string;
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
  getAllProductionReports: async (params?: ProductionReportFilter) => {
    const res = await instance.get("/product-report", {
      params,
    });
    return {
      ...res,
      data: res.data.map((item: ProductionReportType) => ({
        ...item,
        team_id: item.teams?.id ?? item.team_id,
        team_name: item.teams?.team_name ?? item.team_name,
      })),
    };
  },
  createProductionReport: (data: CreateReportPayload) => {
    return instance.post("/product-report", data);
  },
  updateProductReport: (id: number | undefined, data: UpdateReportData) => {
    return instance.patch(`/product-report/${id}`, data);
  },
};

export default productionReportApi;
