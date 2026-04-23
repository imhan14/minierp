export interface ProductionLogDetailFilters {
  id?: number;
  search?: number;
  production_log_id?: number;
}

export interface CreateProductionLogDetailData {
  production_log_id: number;
}

export interface UpdateProductionLogDetailData {
  start_time?: string;
  end_time?: string;
  task_type?: string;
  content?: string;
  quantity?: string;
  product_type?: string;
  pkg_received?: number;
  pkg_returned?: number;
  pkg_damaged?: number;
}
