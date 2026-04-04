import type { Dayjs } from "dayjs";
import type { MaterialReportDisplay } from "../../../schema/materialReport.schema";
import { useCallback, useEffect, useState } from "react";
import materialReportApi from "../../../apis/materialReportApi";

export const useMaterialReportData = (selectedDate?: Dayjs | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materialReports, setMaterialReports] = useState<
    MaterialReportDisplay[]
  >([]);

  const fetchMaterialReportData = async (date?: Dayjs | null) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
    const response = await materialReportApi.getAllMaterialReports({
      date: dateParam,
      team_id: currentUser?.team_id,
    });
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

  const getMaterialReport = useCallback(async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      setMaterialReports(await fetchMaterialReportData(date));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMaterialReport(selectedDate);
  }, [getMaterialReport, selectedDate]);
  return { loading, error, materialReports, getMaterialReport };
};
