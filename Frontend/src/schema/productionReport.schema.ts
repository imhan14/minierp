import type { FieldConfig } from "../types/FieldConfig";
import type { ProductionReportDisplay } from "../types/ProductionReportType";

export const productionReportSchema: Record<
  string,
  FieldConfig<ProductionReportDisplay>
> = {
  id: { id: "id", label: "ID" },
  report_date: {
    id: "report_date",
    label: "Report Date",
    isReadOnly: true,
  },
  team_name: {
    id: "team_name",
    label: "Team Name",
    isReadOnly: true,
  },
  furnace: {
    id: "furnace",
    label: "Furnace",
  },
  shift: {
    id: "shift",
    label: "Shift",
  },
  start_time: {
    id: "start_time",
    label: "Start Time",
  },
  end_time: {
    id: "end_time",
    label: "End Time",
  },
  warehouse_check: {
    id: "warehouse_check",
    label: "Warehouse Check",
  },
  production_check: {
    id: "production_check",
    label: "Production Check",
  },
} as const;
