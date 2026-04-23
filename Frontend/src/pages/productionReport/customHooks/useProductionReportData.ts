import { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import productionReportApi, {
  type ProductionReportFilter,
} from "@/apis/productionReportApi";
import type { ProductionReportDisplay } from "@/types/ProductionReportType";

export const useProductionReportData = (
  selectedDate: Dayjs | null,
  endDate: Dayjs | null = null,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productionReports, setProductionReports] = useState<
    ProductionReportDisplay[]
  >([]);

  const fetchProductionReport = useCallback(
    async (start?: Dayjs | null, endDate?: Dayjs | null) => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const teamIdParam = currentUser?.team_id;

        const params: ProductionReportFilter = {};
        if (endDate && start) {
          params.startDate = start.format("YYYY-MM-DD");
          params.endDate = endDate.format("YYYY-MM-DD");
        } else if (start) {
          params.date = start.format("YYYY-MM-DD");
        }
        if (teamIdParam) params.team_id = teamIdParam;
        const response =
          await productionReportApi.getAllProductionReports(params);
        const formattedData: ProductionReportDisplay[] = response.data.map(
          (item) => {
            const { teams, ...rest } = item;
            return {
              ...rest,
              team_id: teams?.id,
              team_name: teams?.team_name || "N/A",
            };
          },
        );
        setProductionReports(formattedData);
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
    fetchProductionReport(selectedDate, endDate);
  }, [selectedDate, endDate, fetchProductionReport]);
  return {
    productionReports,
    error,
    loading,
    fetchProductionReport,
  };
};
