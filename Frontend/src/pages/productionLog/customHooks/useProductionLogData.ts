import { useCallback, useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import productionLogApi, {
  type ProductionLogFilters,
} from "@/apis/productionLogApi";
import type { ProductionLogDisplay } from "@/types/ProductionLogType";

export const useProductionLogData = (
  selectedDate: Dayjs | null,
  endDate: Dayjs | null = null,
) => {
  const [productionLog, setProductionLog] = useState<ProductionLogDisplay[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatProductionLog = async (
    start?: Dayjs | null,
    endDate?: Dayjs | null,
  ) => {
    const params: ProductionLogFilters = {};
    if (endDate && start) {
      params.startDate = start.format("YYYY-MM-DD");
      params.endDate = endDate.format("YYYY-MM-DD");
    } else if (start) {
      params.date = start.format("YYYY-MM-DD");
    }
    const response = await productionLogApi.getAllProductionLog(params);

    const formattedData: ProductionLogDisplay[] = response.data.map((item) => {
      const { teams, ...rest } = item;
      return {
        ...rest,
        team_id: teams?.id,
        team_name: teams?.team_name || "N/A",
      };
    });
    return formattedData;
  };
  const fetchProductionLog = useCallback(
    async (date?: Dayjs | null, endDate?: Dayjs | null) => {
      try {
        setLoading(true);
        setProductionLog(await formatProductionLog(date, endDate));
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
  return { productionLog, loading, error, fetchProductionLog };
};
