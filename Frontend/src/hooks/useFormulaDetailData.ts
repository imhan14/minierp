import formulaDetailApi from "@/apis/formulaDetailApi";
import type { FormulaDetailDisplay } from "@/types/FormulaDetailType";
import { useEffect, useState } from "react";

export const useFormulaDetailData = (formulaId: number | null) => {
  const [formulaDetail, setFormulaDetail] = useState<FormulaDetailDisplay[]>(
    [],
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormulaDetail = async (formulaId: number | null) => {
    if (!formulaId) return;
    try {
      setDetailLoading(true);
      const response = await formulaDetailApi.getAllFormulaDetails({
        formula_id: formulaId,
      });
      const formattedData: FormulaDetailDisplay[] = response.data.map(
        (item) => {
          const { ingredients, ...rest } = item;
          return {
            ...rest,
            ingredient_name: ingredients?.ingredient_name,
            unit: ingredients?.unit,
          };
        },
      );

      setFormulaDetail(formattedData);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulaDetail(formulaId);
  }, [formulaId]);
  return {
    fetchFormulaDetail,
    formulaDetail,
    detailLoading,
    error,
    setFormulaDetail,
  };
};
