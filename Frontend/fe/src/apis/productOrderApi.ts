import type { ProductOrderType } from "../types/ProductOrderType";
import instance from "./axios";

const productOrderApi = {
  getAllOrders: (params?: unknown) => {
    return instance.get<ProductOrderType[]>("/product-order", {
      params: params,
    });
  },
};

export default productOrderApi;
