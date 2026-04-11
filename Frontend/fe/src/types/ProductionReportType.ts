import type { TeamType } from "./TeamType";

export interface ProductionReportDisplay extends Omit<
  ProductionReportType,
  "teams"
> {
  team_name: string;
}

export interface ProductionReportType {
  id: number;
  report_date: string;
  teams: TeamType;
  furnace: number;
  shift: string;
  start_time: string;
  end_time: string;
  warehouse_check: boolean;
  production_check: boolean;
}
