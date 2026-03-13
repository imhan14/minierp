import type { FieldConfig } from "../types/FieldConfig";
import dayjs from "dayjs";
import type { MaterialReportType } from "../types/MaterialReportType";

export interface MaterialReportDisplay extends Omit<
  MaterialReportType,
  "teams"
> {
  team_name: string;
}

export const materialReportSchema: FieldConfig<MaterialReportDisplay>[] = [
  { id: "id", label: "ID", inTable: true },
  {
    id: "team_name",
    label: "Team Name",
    inTable: true,
    inGeneral: true,
    isReadOnly: true,
  },
  {
    id: "report_date",
    label: "Report Date",
    inTable: true,
    inGeneral: true,
    isReadOnly: true,
    render: ((value: string) => {
      if (!value) return "-";
      return dayjs(value).add(24, "hour").format("DD/MM/YYYY");
    }) as FieldConfig<MaterialReportDisplay>["render"],
  },
  {
    id: "shift",
    label: "Shift",
    inTable: true,
    inGeneral: true,
    isCellEditable: true,
    inputType: "text",
  },
  {
    id: "start_time",
    label: "Start Time",
    render: ((value: string) => {
      if (!value) return "-";
      return dayjs(value).add(24, "hour").format("HH:mm");
    }) as FieldConfig<MaterialReportDisplay>["render"],
  },
  {
    id: "end_time",
    label: "End Time",
    render: ((value: string) => {
      if (!value) return "-";
      return dayjs(value).add(24, "hour").format("HH:mm");
    }) as FieldConfig<MaterialReportDisplay>["render"],
  },
  { id: "actions", label: "Details", align: "left" },
];
