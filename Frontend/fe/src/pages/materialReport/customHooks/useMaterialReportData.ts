import type { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import materialReportApi, {
  type MaterialReportFilters,
} from "@/apis/materialReportApi";
import type { MaterialReportDisplay } from "@/types/MaterialReportType";

export const useMaterialReportData = (
  selectedDate?: Dayjs | null,
  endDate: Dayjs | null = null,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materialReports, setMaterialReports] = useState<
    MaterialReportDisplay[]
  >([]);

  const fetchMaterialReportData = async (
    start?: Dayjs | null,
    endDate?: Dayjs | null,
  ) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const params: MaterialReportFilters = {};
    if (endDate && start) {
      params.startDate = start.format("YYYY-MM-DD");
      params.endDate = endDate.format("YYYY-MM-DD");
    } else if (start) {
      params.date = start.format("YYYY-MM-DD");
    }
    if (currentUser?.team_id) params.team_id = currentUser?.team_id;
    // const dateParam = date?.isValid() ? start.format("YYYY-MM-DD") : "";
    const response = await materialReportApi.getAllMaterialReports(params);
    const formattedData: MaterialReportDisplay[] = response.data.map((item) => {
      const { teams, ...rest } = item;
      return {
        ...rest,
        team_id: teams?.id,
        team_name: teams?.team_name || "N/A",
      };
    });
    return formattedData;
  };

  const getMaterialReport = useCallback(
    async (date?: Dayjs | null, endDate?: Dayjs | null) => {
      try {
        setLoading(true);
        setMaterialReports(await fetchMaterialReportData(date, endDate));
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
    getMaterialReport(selectedDate, endDate);
  }, [getMaterialReport, selectedDate, endDate]);
  return { loading, error, materialReports, getMaterialReport };
};
