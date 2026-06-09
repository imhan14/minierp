import productionApi from "@/apis/productionApi";
import {
  ProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  type ProductType,
  type ProductCreatePayload,
  type ProductUpdatePayload,
} from "@/schema/product.schema";
import BaseEntityPage from "../BaseEntityPage";
import { productFilterOptions } from "./utils/product.constants";

const ProductPage = () => (
  <BaseEntityPage<ProductType, ProductCreatePayload, ProductUpdatePayload>
    fetchAll={productionApi.getAllProducts}
    service={{
      create: productionApi.createProduct,
      update: productionApi.updateProduct,
      // delete: productionApi.deleteProduct,
    }}
    zodSchema={ProductSchema}
    createSchema={CreateProductSchema}
    updateSchema={UpdateProductSchema}
    addButtonLabel="Add new Product"
    addPopupTitle="Thêm sản phẩm mới"
    editPopupTitle="Chỉnh sửa sản phẩm"
    deleteConfirmMessage={(row) => `Xóa sản phẩm "${row.product_name}"?`}
    fieldWidths={{ product_code: 100, product_name: 300, unit: 100 }}
    disabledOnEdit={["product_code"]}
    filterOptions={productFilterOptions}
    messages={{
      createSuccess: "Thêm sản phẩm thành công!",
      updateSuccess: "Cập nhật thành công!",
      deleteSuccess: "Xóa thành công!",
    }}
  />
);

export default ProductPage;
