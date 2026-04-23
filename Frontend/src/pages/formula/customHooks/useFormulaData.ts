import formulaApi, { type FormulaFilters } from "@/apis/formulaApi";
import type { FormulaDisplay } from "@/types/FormulaType";
import { useCallback, useEffect, useState } from "react";

export const useFormulaData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formula, setFormula] = useState<FormulaDisplay[]>([]);

  const fetchFormula = useCallback(async (newFilters?: FormulaFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await formulaApi.getAllFormula(newFilters || {});
      const formattedData: FormulaDisplay[] = response.data.map((item) => {
        const { products, ...rest } = item;
        return {
          ...rest,
          product_id: products?.id,
          product_name: products?.product_name || "N/A",
        };
      });

      setFormula(formattedData);
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
