import type { TeamType } from "./TeamType";
export interface ProductionLogDisplay extends Omit<ProductionLogType, "teams"> {
  team_name: string;
  team_id: number;
}

export interface ProductionLogType {
  id: number;
  number_of_employee: number;
  on_work: number;
  unauthorized_absence: string;
  authorized_absence: string;
  ht_di: string;
  ht_den: string;
  forklift: string;
  shift_leader: string;
  teams: TeamType;
  //   extral_log:
  electric_production: number;
  electric_mix: number;
  log_date: string;
  log_start: string;
  log_end: string;
}
