import type { ProductionLogType } from "@/schema/productionLog.schema";
import instance from "./axios";

export interface ProductionLogFilters {
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProductionLogData {
  log_date?: string;
  team_id?: number;
  electric_production?: number | undefined;
  electric_mix?: number | undefined;
  log_start?: string | undefined;
  log_end?: string | undefined;
  number_of_employee?: number | undefined;
  on_work?: number | undefined;
  unauthorized_absence?: string | undefined;
  authorized_absence?: string | undefined;
  ht_di?: string | undefined;
  ht_den?: string | undefined;
  forklift?: string | undefined;
  shift_leader?: string | undefined;
}

const productionLogApi = {
  getAllProductionLog: async (params?: ProductionLogFilters) => {
    const res = await instance.get("/production-log", {
      params,
    });
    return {
      ...res,
      data: res.data.map((item: ProductionLogType) => ({
        ...item,
        team_id: item.teams?.id ?? item.team_id,
        team_name: item.teams?.team_name ?? item.team_name,
      })),
    };
  },
  createProductionLog: (data: ProductionLogData) => {
    return instance.post("/production-log", data);
  },
  updateProductionLog: (id: number, data: ProductionLogData) => {
    console.log(id);
    console.log(data);
    return instance.patch(`/production-log/${id}`, data);
  },
};

export default productionLogApi;
