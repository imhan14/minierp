import type { Dayjs } from "dayjs";
import api from "../../apis/axios";
import type { ProductionReportType } from "../../types/ProductionReportType";
import type { ProductionReportDisplay } from "../../schema/productionReport.schema";

export const fetchProductionReportData = async (date?: Dayjs | null) => {
  const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
  const response = await api.get<ProductionReportType[]>(`/product-report`, {
    params: { date: dateParam },
  });
  const formattedData: ProductionReportDisplay[] = response.data.map((item) => {
    const { teams, ...rest } = item;
    return {
      ...rest,
      team_id: teams?.id,
      team_name: teams?.team_name || "N/A",
    };
  });
  console.log(localStorage.getItem("user"));
  return formattedData;
};
export const fetchAddNewReport = async (date?: Dayjs | null) => {
  const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
  const payload = {
    team_id: 1,
    report_date: dateParam,
  };
  console.log(payload);
  return await api.post<ProductionReportType[]>(`/product-report`, payload);
};
