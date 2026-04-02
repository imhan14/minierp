import instance from "./axios";

export interface ProductionLogDetailFilters {
  date?: string;
  production_log_id?: number;
}

const productionLogDetailApi = {
  getAllProductionLogDetails: (filters?: ProductionLogDetailFilters) => {
    return instance.get("/production-log-detail", { params: filters });
  },
  // updateProductionLogDetail:(id, data) =>{
  //   reutrn instance.patch()
  // }
};

export default productionLogDetailApi;
