import { useCallback, useState } from "react";
import materialDetailApi from "@/apis/materialDetailApi";
import type { MaterialDetailType } from "@/schema/materialDetail.schema";
import type { IngredientType } from "@/schema/ingredient.schema";
import ingredientApi from "@/apis/ingredientApi";

const useMaterialDetailData = () => {
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<MaterialDetailType[]>([]);
  const [ingredientOptions, setIngredientOptions] = useState<IngredientType[]>(
    [],
  );

  const fetchDetails = useCallback(async (material_id: number | null) => {
    if (!material_id) return;
    try {
      setDetailLoading(true);
      const [detailRes, ingRes] = await Promise.all([
        materialDetailApi.getAllMaterialDetails({ material_id }),
        ingredientApi.getAllIngredients(),
      ]);
      console.log(detailRes.data);
      // flatten ingredient_name từ join
      const flat: MaterialDetailType[] = detailRes.data.map((item) => ({
        ...item,
        id: item.ingredients?.id ?? item.ingredient_id,
        label: item.ingredients?.ingredient_name ?? item.ingredient_name,
      }));
      setRows(flat);
      setIngredientOptions(ingRes.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  return {
    fetchDetails,
    detailLoading,
    error,
    rows,
    setRows,
    ingredientOptions,
  };
};

export default useMaterialDetailData;
