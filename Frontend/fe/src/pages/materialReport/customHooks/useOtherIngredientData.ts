import { useCallback, useState } from "react";
import mateiralDetailApi from "../../../apis/materialDetailApi";
import type { MaterialDetailDisplay } from "../../../schema/materialDetail.schema";

const useOtherIngredientData = () => {
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editIngredients, setEditIngredients] = useState<
    MaterialDetailDisplay[]
  >([]);

  const getMaterialReportDetail = async (
    material_id: number | null | undefined,
  ) => {
    const response = await mateiralDetailApi.getAllMaterialDetails({
      material_id: material_id,
    });
    const formattedData: MaterialDetailDisplay[] = response.data.map((item) => {
      const { ingredients, ...rest } = item;
      return {
        ...rest,
        ingredient_name: ingredients?.ingredient_name,
      };
    });
    return formattedData;
  };
  const fetchMaterialReportDetail = useCallback(
    async (material_id: number | null | undefined) => {
      try {
        setDetailLoading(true);
        setEditIngredients(await getMaterialReportDetail(material_id));
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu.");
        console.error("API Error:", err);
      } finally {
        setDetailLoading(false);
      }
    },
    [],
  );
  return {
    fetchMaterialReportDetail,
    error,
    detailLoading,
    editIngredients,
    setEditIngredients,
  };
};

export default useOtherIngredientData;
