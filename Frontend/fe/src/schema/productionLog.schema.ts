import type { FieldConfig } from "../types/FieldConfig";
import type { ProductionLogDisplay } from "../types/ProductionLogType";

export const productionLogSchema: Record<
  string,
  FieldConfig<ProductionLogDisplay>
> = {
  id: { id: "id", label: "ID" },
  number_of_employee: { id: "number_of_employee", label: "Number of employee" },
  on_work: {
    id: "on_work",
    label: "On work",
  },
  unauthorized_absence: {
    id: "unauthorized_absence",
    label: "Unauthorized Absence",
  },
  authorized_absence: {
    id: "authorized_absence",
    label: "Authorized Absence",
  },
  ht_di: {
    id: "ht_di",
    label: "HT Di",
  },
  ht_den: {
    id: "ht_den",
    label: "HT Den",
  },
  forklift: {
    id: "forklift",
    label: "Forklift",
  },
  shift_leader: {
    id: "shift_leader",
    label: "Shift Leader",
  },
  team_name: {
    id: "team_name",
    label: "Team Name",
  },
  electric_production: {
    id: "electric_production",
    label: "Electric Production",
  },
  electric_mix: {
    id: "electric_mix",
    label: "Electric Mix",
  },
  log_date: {
    id: "log_date",
    label: "Log Date",
  },
  log_start: {
    id: "log_start",
    label: "Log Start",
  },
  log_end: {
    id: "log_end",
    label: "Log End",
  },
};
