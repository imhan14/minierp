import formulaApi, { type FormulaFilters } from "@/apis/formulaApi";
import type { FormulaDisplay } from "@/types/FormulaType";
import { useCallback, useEffect, useState } from "react";

export const useFormulaData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formula, setFormula] = useState<FormulaDisplay[]>([]);

  const formatFormula = async (newFilters?: FormulaFilters) => {
    const params: FormulaFilters = { ...newFilters };

    const response = await formulaApi.getAllFormula(params);

    const formattedData: FormulaDisplay[] = response.data.map((item) => {
      const { products, ...rest } = item;
      return {
        ...rest,
        product_id: products?.id,
        product_name: products?.product_name || "N/A",
      };
    });
    return formattedData;
  };
  const fetchFormula = useCallback(async (newFilters?: FormulaFilters) => {
    try {
      setLoading(true);
      setFormula(await formatFormula(newFilters));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchFormula();
  }, [fetchFormula]);

  return { loading, error, formula, fetchFormula };
};
