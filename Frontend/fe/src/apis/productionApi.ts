import type { ProductType } from "../types/ProductType";
import instance from "./axios";

interface productFilters {
  id?: number;
}
const productionApi = {
  getAllProducts: (params?: productFilters) => {
    return instance.get<ProductType[]>("/product", { params: params });
  },
};

export default productionApi;
