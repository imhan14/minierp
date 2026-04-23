export interface ProductionLogFilters {
  id?: number;
  sreach?: string;
  date?: string;
  team_id?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CreateProductLogData {
  log_date: string;
  team_id?: number;
}

export interface UpdateProductLogData {
  team_id?: number;
  log_date?: string;
  number_of_employee?: number;
  on_work?: number;
  unauthorized_absence?: string;
  authorized_absence?: string;
  ht_di?: string;
  ht_den?: string;
  forklift?: string;
  shift_leader?: string;
  electric_mix?: number;
  log_start?: string;
  log_end?: string;
}
