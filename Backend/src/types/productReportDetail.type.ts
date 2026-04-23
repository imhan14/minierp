export interface ProductReportDetailFilters {
  id?: number;
  search?: string;
  report_id?: number;
}

export interface CreateProductReportDetailData {
  report_id: number;
  product_id: number;
  weight: number;
  is_finish?: boolean;
  type_of_specification?: string;
  product_line?: string;
  specification?: string;
  start_time?: string;
  end_time?: string;
  note?: string;
}

export interface UpdateProductReportDetailData {
  product_id?: number;
  weight?: number;
  is_finish?: boolean;
  type_of_specification?: string;
  product_line?: string;
  specification?: string;
  start_time?: string;
  end_time?: string;
  note?: string;
}
