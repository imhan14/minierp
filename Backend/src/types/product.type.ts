export interface ProductFilters {
  id?: number;
  search?: string;
}

export interface UpdateProductData {
  product_code: string;
  product_name?: string;
  unit?: string;
  description?: string;
}

export interface CreateProductData {
  product_code: string;
  product_name: string;
  unit: string;
  description?: string;
}
