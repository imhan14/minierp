import type { Dayjs } from "dayjs";
import api from "../../apis/axios";
import type { ProductionReportType } from "../../types/ProductionReportType";
import type { ProductionReportDisplay } from "../../schema/productionReport.schema";
import type { ProductReportDetailType } from "../../types/ProductReportDetailType";
import type { ProductionReportDetailDisplay } from "../../schema/productReportDetail.schema";

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
  return formattedData;
};
export const getProductionReportDetail = async (report_id: number | null) => {
  const response = await api.get<ProductReportDetailType[]>(
    `/product-report-detail`,
    {
      params: { report_id: report_id },
    },
  );
  const formattedData: ProductionReportDetailDisplay[] = response.data.map(
    (item) => {
      const { products, ...rest } = item;
      return {
        ...rest,
        product_id: products?.id,
        product_name: products?.product_name || "N/A",
      };
    },
  );
  return formattedData;
};
export const fetchAddNewReport = async (date?: Dayjs | null) => {
  const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
  const userString = localStorage.getItem("user");
  let teamId: number | null = null;
  if (userString) {
    try {
      const user = JSON.parse(userString);
      teamId = user.team_id;
    } catch (error) {
      console.error("Lỗi khi parse user data:", error);
    }
  }
  const payload = {
    team_id: teamId,
    report_date: dateParam,
  };
  return await api.post<ProductionReportType[]>(`/product-report`, payload);
};
