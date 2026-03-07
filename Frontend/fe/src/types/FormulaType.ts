import type { Dayjs } from "dayjs";

export interface FormulaType {
  id: number;
  formula_code: number;
  formula_name: string;
  product_id: number;
  is_active: boolean;
  product_line: string;
  specification: string;
  color: string;
  type_of_specifications: string;
  created_at: Dayjs;
  created_by: string;
}
