import type { ProductionLogType } from "../types/ProductionLogType";
import instance from "./axios";

export interface ProductionLogFilters {
  date?: string;
}

export interface ProductionLogData {
  log_date?: string;
  team_id?: number;
}

const productionLogApi = {
  getAllProductionLog: (filters?: ProductionLogFilters) => {
    return instance.get<ProductionLogType[]>("/production-log", {
      params: filters,
    });
  },
  createProductionLog: (data: ProductionLogData) => {
    return instance.post<ProductionLogType>("/production-log", data);
  },
};

export default productionLogApi;
