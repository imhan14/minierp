import type { ProductionLogType } from "../types/ProductionLogType";
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
  getAllProductionLog: (params?: ProductionLogFilters) => {
    return instance.get<ProductionLogType[]>("/production-log", {
      params,
    });
  },
  createProductionLog: (data: ProductionLogData) => {
    return instance.post<ProductionLogType>("/production-log", data);
  },
  updateProductionLog: (id: number, data: ProductionLogData) => {
    return instance.patch(`/production-log/${id}`, data);
  },
};

export default productionLogApi;
