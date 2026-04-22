export interface OrderFilters {
  id?: number;
  search?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateOrderData {
  order_date: string;
}

export interface UpdateOrderData {
  formula_id?: number;
  team_id?: number;
  product_shift?: string;
  target_quantity?: number;
  urea_rate?: number;
  status?: string;
  input_temprature_1?: number;
  output_temprature_1?: number;
  input_temprature_2?: number;
  output_temprature_2?: number;
  order_note?: string;
  order_date?: string;
}
