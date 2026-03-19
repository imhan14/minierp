import type { TeamType } from "./TeamType";

export interface ExtraMaterialsJson {
  id?: number | string;
  ingredient_name: string;
  weight: number;
  real_percent: number;
  note: string;
}
export interface MaterialReportType {
  id: number;
  teams: TeamType;
  report_date: string;
  shift: string;
  start_time: string;
  end_time: string;
  foreman_check: boolean;
  extral_materials: ExtraMaterialsJson[] | null;
}
