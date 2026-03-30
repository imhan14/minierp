import instance from "./axios";

export interface ProductionLogFilters {
  date?: string;
}

const productionLogApi = {
  getAllProductionLog: (filters: ProductionLogFilters) => {
    return instance.get("/production-log", { params: filters });
  },
};

export default productionLogApi;
