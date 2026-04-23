import instance from "./axios";

export interface ProductionLogDetailFilters {
  date?: string;
  production_log_id?: number;
}

export interface LogDetailData {
  production_log_id?: number | undefined;
  start_time?: string | undefined;
  end_time?: string | undefined;
  task_type?: string | undefined;
  content?: string | undefined;
  quantity?: number | undefined;
  product_type?: string | undefined;
  pkg_received?: number | undefined;
  pkg_returned?: number | undefined;
  pkg_damaged?: number | undefined;
}

const productionLogDetailApi = {
  getAllProductionLogDetails: (filters?: ProductionLogDetailFilters) => {
    return instance.get("/production-log-detail", { params: filters });
  },
  updateProductionLogDetail: (id: number | string, data: LogDetailData) => {
    return instance.patch(`/production-log-detail/${id}`, data);
  },
  createProductionLogDetail: (data: LogDetailData) => {
    return instance.post(`/production-log-detail`, data);
  },
  deleteProductionLogDetail: (id: number | string) => {
    return instance.delete(`/production-log-detail/${id}`);
  },
};

export default productionLogDetailApi;
