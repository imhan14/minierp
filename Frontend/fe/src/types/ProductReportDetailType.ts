import type { ProductionReportType } from "./ProductionReportType";
import type { ProductType } from "./ProductType";

export interface ProductReportDetailType {
  id: number;
  products: ProductType;
  product_reports: ProductionReportType;
  is_finish: boolean;
  type_of_specification: string;
  product_line: string;
  strat_time: string;
  end_time: string;
  weight: number;
  note: string;
}
