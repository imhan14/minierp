import type { Dayjs } from "dayjs";
import type { MaterialReportDisplay } from "../../schema/materialReport.schema";
import type { MaterialReportType } from "../../types/MaterialReportType";
import api from "../../apis/axios";
import type { MaterialDetailType } from "../../types/MaterialDetailType";
import type { MaterialDetailDisplay } from "../../schema/materialDetail.schema";

export const fetchMaterialReportData = async (date?: Dayjs | null) => {
  const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
  const response = await api.get<MaterialReportType[]>(`/material-report`, {
    params: { date: dateParam },
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

export const fetchIngredientData = async (
  material_id: number | null | undefined,
) => {
  const response = await api.get<MaterialDetailType[]>(`/material-detail`, {
    params: { material_id: material_id },
  });
  const formattedData: MaterialDetailDisplay[] = response.data.map((item) => {
    const { ingredients, ...rest } = item;
    return {
      ...rest,
      ingredient_name: ingredients?.ingredient_name,
    };
  });
  return formattedData;
};

export const fetchAddNewReport = async (date?: Dayjs | null) => {
  const dateParam = date?.isValid() ? date.format("DD-MM-YYYY") : "";
  const payload = {
    team_id: 1,
    report_date: dateParam,
  };
  return await api.post<MaterialReportType[]>(`/material-report`, payload);
};
