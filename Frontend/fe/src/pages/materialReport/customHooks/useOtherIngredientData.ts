import { useCallback, useState } from "react";
import type {
  ExtraMaterialsJson,
  MaterialReportDisplay,
} from "@/types/MaterialReportType";

const useOtherIngredientData = (
  extral_material: MaterialReportDisplay | null,
) => {
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editIngredients, setEditIngredients] = useState<ExtraMaterialsJson[]>(
    [],
  );

  const getOtherIngredients = useCallback(() => {
    try {
      setDetailLoading(true);
      const materialsWithIds = (extral_material?.extral_materials || []).map(
        (item, index) => ({
          ...item,
          id: item.id || `${extral_material?.id}-${index}`,
        }),
      );
      setEditIngredients(materialsWithIds);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  }, [extral_material]);
  return {
    getOtherIngredients,
    error,
    detailLoading,
    editIngredients,
    setEditIngredients,
  };
};

export default useOtherIngredientData;
