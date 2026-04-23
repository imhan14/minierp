import type { TeamType } from "../types/TeamType";
import type { FormulaType } from "../types/FormulaType";

export interface OrderDisplay extends Omit<
  ProductOrderType,
  "teams" | "formulas"
> {
  formula_id: number;
  team_name: string;
  formula_name: string;
  team_id: number;
}
export interface ProductOrderType {
  id: number;
  order_date: string;
  formulas: FormulaType;
  teams: TeamType;
  product_shift: string;
  target_quantity: number;
  urea_rate?: number | null;
  status: "ok" | "pending" | "cancel" | string;
  input_temprature_1: number;
  output_temprature_1: number;
  input_temprature_2: number;
  output_temprature_2: number;
  order_note: string;
  created_at: string;
  created_by: number;
}
