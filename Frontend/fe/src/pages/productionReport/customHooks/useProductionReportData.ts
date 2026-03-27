import { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import productionReportApi from "../../../apis/productionReportApi";
import type { ProductionReportDisplay } from "../../../schema/productionReport.schema";

export const useProductionReportData = (selectedDate: Dayjs | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productionReports, setProductionReports] = useState<
    ProductionReportDisplay[]
  >([]);

  const fetchProductionReport = useCallback(async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const teamIdParam = currentUser?.team_id;
      const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
      const response = await productionReportApi.getAllProductionReports({
        date: dateParam,
        team_id: teamIdParam,
      });
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
  }, []);
  useEffect(() => {
    fetchProductionReport(selectedDate);
  }, [selectedDate, fetchProductionReport]);
  return {
    productionReports,
    error,
    loading,
    fetchProductionReport,
  };
};
