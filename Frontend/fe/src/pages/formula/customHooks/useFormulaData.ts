import formulaApi, { type FormulaFilters } from "@/apis/formulaApi";
import type { FormulaDisplay } from "@/types/FormulaType";
import type { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";

export const useFormulaData = (
  selectedDate: Dayjs | null,
  endDate: Dayjs | null = null,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formula, setFormula] = useState<FormulaDisplay[]>([]);

  const formatFormula = async (
    start?: Dayjs | null,
    endDate?: Dayjs | null,
  ) => {
    const params: FormulaFilters = {};
    if (endDate && start) {
      params.startDate = start.format("YYYY-MM-DD");
      params.endDate = endDate.format("YYYY-MM-DD");
    } else if (start) {
      params.date = start.format("YYYY-MM-DD");
    }
    const response = await formulaApi.getAllFormula(params);

    const formattedData: FormulaDisplay[] = response.data.map((item) => {
      const { products, ...rest } = item;
      return {
        ...rest,
        product_id: products?.id,
        product_name_name: products?.team_name || "N/A",
      };
    });
    return formattedData;
  };
  const fetchProductionLog = useCallback(
    async (date?: Dayjs | null, endDate?: Dayjs | null) => {
      try {
        setLoading(true);
        setFormula(await formatFormula(date, endDate));
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  useEffect(() => {
    fetchProductionLog(selectedDate, endDate);
  }, [selectedDate, endDate, fetchProductionLog]);

  return { loading, error, formula };
};
