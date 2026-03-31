import instance from "./axios";

export interface ProductionLogDetailFilters {
  date?: string;
}

const productionLogDetailApi = {
  getAllProductionLogDetails: (filters?: ProductionLogDetailFilters) => {
    return instance.get("/production-log-detail", { params: filters });
  },
};

export default productionLogDetailApi;
