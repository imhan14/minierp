import instance from "./axios";

export interface ProductFilters {
  id?: number;
  orderBy?: string;
}
export interface ProductData {
  product_code?: string;
  product_name?: string;
  unit?: string;
  description?: string;
}
const productionApi = {
  getAllProducts: (params?: ProductFilters) => {
    return instance.get("/product", { params: params });
  },
  createProduct: (data: ProductData) => {
    return instance.post("/product", data);
  },
  updateProduct: (id: number, data: ProductData) => {
    return instance.patch(`/product/${id}`, data);
  },
};

export default productionApi;
