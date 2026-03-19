import type { FieldConfig } from "../types/FieldConfig";
import type { MaterialReportType } from "../types/MaterialReportType";

export interface MaterialReportDisplay extends Omit<
  MaterialReportType,
  "teams"
> {
  team_name: string;
}

export const materialReportSchema: Record<
  string,
  FieldConfig<MaterialReportDisplay>
> = {
  id: { id: "id", label: "ID" },
  team_name: {
    id: "team_name",
    label: "Team Name",
    isReadOnly: true,
  },
  report_date: {
    id: "report_date",
    label: "Report Date",
    isReadOnly: true,
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
} as const;
