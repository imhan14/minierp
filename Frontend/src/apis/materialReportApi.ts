import type {
  ExtraMaterialsJson,
  MaterialReportType,
} from "@/schema/materialReport.schema";
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
  // foreman_check?: boolean | undefined;
  start_time?: string;
  end_time?: string;
  shift?: string;
  extral_materials?: ExtraMaterialsJson[] | null;
}

const materialReportApi = {
  getAllMaterialReports: async (params?: MaterialReportFilters) => {
    const res = await instance.get("/material-report", {
      params,
    });
    return {
      ...res,
      data: res.data.map((item: MaterialReportType) => ({
        ...item,
        team_id: item.teams?.id ?? item.team_id,
        team_name: item.teams?.team_name ?? item.team_name,
      })),
    };
  },
  createMaterialReport: (data: MaterialReportData) => {
    return instance.post("/material-report", data);
  },
  updateMaterialReport: (id: number | undefined, data: MaterialReportData) => {
    return instance.patch(`/material-report/${id}`, data);
  },
};

export default materialReportApi;
