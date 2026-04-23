export interface MaterialReportFilters {
  id?: number;
  sreach?: string;
  date?: string;
  team_id?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CreateMaterialReportData {
  report_date: string;
  team_id?: number;
}

export interface UpdateMaterialReportData {
  report_date?: string;
  shift?: string;
  foreman_check?: boolean;
  start_time?: string;
  end_time?: string;
  extral_materials: ExtralMaterialData;
}

export interface ExtralMaterialData {
  ingredient_name?: string;
  weight?: string;
  real_percent?: number;
  note?: string;
}
