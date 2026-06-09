import { useCallback, useState } from "react";

import type {
  ExtraMaterialsJson,
  MaterialReportType,
} from "@/schema/materialReport.schema";

const useOtherIngredientData = (extral_material: MaterialReportType) => {
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
          id: item.id ?? Date.now() + index,
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
