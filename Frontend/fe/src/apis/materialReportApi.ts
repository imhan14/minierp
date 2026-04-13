import type {
  ExtraMaterialsJson,
  MaterialReportType,
} from "../types/MaterialReportType";
import instance from "./axios";
export interface MaterialReportFilters {
  date?: string;
  team_id?: number;
  startDate?: string;
  endDate?: string;
}
export interface MaterialReportData {
  team_id?: number;
  report_date?: string;
  foreman_check?: boolean | undefined;
  start_time?: string | undefined;
  end_time?: string | undefined;
  shift?: string | undefined;
  extral_materials?: ExtraMaterialsJson[];
}

const materialReportApi = {
  getAllMaterialReports: (params: MaterialReportFilters) => {
    return instance.get<MaterialReportType[]>("/material-report", {
      params,
    });
  },
  createMaterialReport: (data: MaterialReportData) => {
    return instance.post<MaterialReportType>("/material-report", data);
  },
  updateMaterialReport: (id: number | undefined, data: MaterialReportData) => {
    return instance.patch(`/material-report/${id}`, data);
  },
};

export default materialReportApi;
