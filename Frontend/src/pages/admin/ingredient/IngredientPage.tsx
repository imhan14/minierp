import ingredientApi from "@/apis/ingredientApi";
import {
  IngredientSchema,
  CreateIngredientSchema,
  UpdateIngredientSchema,
  type IngredientType,
  type IngredientCreatePayload,
  type IngredientUpdatePayload,
} from "@/schema/ingredient.schema";
import BaseEntityPage from "../BaseEntityPage";
import { ingredientFilterOptions } from "./utils/ingredient.constants";

const IngredientPage = () => (
  <BaseEntityPage<
    IngredientType,
    IngredientCreatePayload,
    IngredientUpdatePayload
  >
    fetchAll={ingredientApi.getAllIngredients}
    service={{
      create: ingredientApi.createIngredient,
      update: ingredientApi.update,
      delete: ingredientApi.deleteIngredient,
    }}
    zodSchema={IngredientSchema}
    createSchema={CreateIngredientSchema}
    updateSchema={UpdateIngredientSchema}
    addButtonLabel="Add new Ingredient"
    addPopupTitle="Thêm nguyên liệu mới"
    editPopupTitle="Chỉnh sửa nguyên liệu"
    deleteConfirmMessage={(row) => `Xóa nguyên liệu "${row.ingredient_name}"?`}
    fieldWidths={{ ingredient_code: 130, ingredient_name: 200, unit: 100 }}
    disabledOnEdit={["ingredient_code"]}
    filterOptions={ingredientFilterOptions}
    messages={{
      createSuccess: "Thêm nguyên liệu thành công!",
      updateSuccess: "Cập nhật thành công!",
      deleteSuccess: "Xóa thành công!",
    }}
  />
);

export default IngredientPage;
