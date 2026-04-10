import type { ProductOrderType } from "../types/ProductOrderType";
import instance from "./axios";
export interface OrderData {
  formula_id?: number;
  team_id?: number;
  order_date?: string;
  product_shift?: string;
  target_quantity?: number;
  urea_rate?: number | null;
  status?: "ok" | "pending" | "cancel" | string;
  input_temprature_1?: number;
  output_temprature_1?: number;
  input_temprature_2?: number;
  output_temprature_2?: number;
  order_note?: string;
  created_by?: number;
}

const productOrderApi = {
  getAllOrders: (params?: unknown) => {
    return instance.get<ProductOrderType[]>("/product-order", {
      params: params,
    });
  },
  createOrder: (data: OrderData) => {
    return instance.post<ProductOrderType>("/product-order", data);
  },
  updateOrder: (id: number | null, data: OrderData) => {
    return instance.patch(`/product-order/${id}`, data);
  },
};

export default productOrderApi;
