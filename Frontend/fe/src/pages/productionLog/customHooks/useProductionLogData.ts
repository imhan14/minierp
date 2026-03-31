import { useCallback, useState } from "react";
import type { Dayjs } from "dayjs";
import productionLogApi from "../../../apis/productionLogApi";
import type { ProductionLogDisplay } from "../../../types/ProductionLogType";

export const useProductionLogData = () => {
  const [productionLog, setProductionLog] = useState<ProductionLogDisplay[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatProductionLog = async (date?: Dayjs | null) => {
    const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
    const response = await productionLogApi.getAllProductionLog({
      date: dateParam,
    });

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
  const fetchProductionLog = useCallback(async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      setProductionLog(await formatProductionLog(date));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  return { productionLog, loading, error, fetchProductionLog };
};
