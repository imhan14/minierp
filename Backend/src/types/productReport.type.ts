export interface ProductReportFilters {
  id?: number;
  date?: string;
  team_id?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CreateProductReportData {
  report_date: string;
  team_id?: number;
}

export interface UpdateProductReportData {
  team_id?: number;
  furnace?: number;
  shift?: string;
  warehouse_check?: boolean;
  start_time?: string;
  end_time?: string;
  production_check?: boolean;
}
