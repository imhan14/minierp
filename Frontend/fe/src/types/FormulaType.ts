import type { Dayjs } from "dayjs";
import type { ProductType } from "./ProductType";

export interface FormulaDisplay extends Omit<FormulaType, "products"> {
  product_name: string;
  product_id: number;
}
export interface FormulaType {
  id: number;
  formula_code: number;
  formula_name: string;
  products: ProductType;
  is_active: boolean;
  product_line: string;
  specification: string;
  color: string;
  type_of_specification: string;
  created_at: Dayjs;
  created_by: string;
}
