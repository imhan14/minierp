import type { ProductionReportType } from "@/schema/productionReport.schema";
import type { FieldConfig } from "@/types/FieldConfig";
import dayjs from "dayjs";
import { ACTIVE_OPTIONS, SHIFT_OPTIONS } from "./productionReport.constant";
import { Box } from "@mui/material";
const getLabel = (
  options: { label: string; value: string }[],
  value: unknown,
) =>
  options.find((o) => o.value === String(value))?.label ?? String(value ?? "-");

export const PRODUCTION_REPORT_FIELD_CONFIGS: Partial<
  Record<keyof ProductionReportType, FieldConfig<ProductionReportType>>
> = {
  team_id: {
    id: "team_id",
    label: "team_id",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  team_name: {
    id: "team_name",
    label: "Tổ",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    isReadOnly: true,
    required: true,
  },
  report_date: {
    id: "report_date",
    label: "Ngày",
    inputType: "datetime-local",
    gridSize: { xs: 12, sm: 6 },
    required: true,
    render: (value) =>
      value ? dayjs(value as string).format("DD/MM/YYYY") : "-",
  },
  start_time: {
    id: "start_time",
    label: "Bắt đầu",
    inputType: "datetime-local",
    gridSize: { xs: 12, sm: 6 },
    required: true,
    render: (value) =>
      value ? dayjs(value as string).format("HH:mm DD/MM") : "-",
  },
  end_time: {
    id: "end_time",
    label: "Kết thúc",
    inputType: "datetime-local",
    gridSize: { xs: 12, sm: 6 },
    render: (value) =>
      value ? dayjs(value as string).format("HH:mm DD/MM") : "-",
  },
  furnace: {
    id: "furnace",
    label: "Lo Dot",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
  },
  shift: {
    id: "shift",
    label: "Ca",
    inputType: "select",
    options: SHIFT_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => getLabel(SHIFT_OPTIONS, value),
  },
  warehouse_check: {
    id: "warehouse_check",
    label: "warehouse_check",
    inputType: "select",
    options: ACTIVE_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => renderBadge(value, ACTIVE_OPTIONS),
  },
  production_check: {
    id: "production_check",
    label: "production_check",
    inputType: "select",
    options: ACTIVE_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => renderBadge(value, ACTIVE_OPTIONS),
  },
  created_by: {
    id: "created_by",
    label: "Người tạo",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    isReadOnly: true,
  },
  created_at: {
    id: "created_at",
    label: "Ngày tạo",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    isReadOnly: true,
  },
};

/** DataTable */
export const PRODUCTION_REPORT_TABLE_FIELDS: (keyof ProductionReportType)[] = [
  "team_name",
  "report_date",
  "start_time",
  "end_time",
  "shift",
];

/** Add New */
export const PRODUCTION_REPORT_ADD_FIELDS: (keyof ProductionReportType)[] = [
  "team_id",
  // "team_name",
  "report_date",
  "start_time",
  "end_time",
  "shift",
  "furnace",
];

/** Edit */
export const PRODUCTION_REPORT_EDIT_FIELDS: (keyof ProductionReportType)[] = [
  // "team_name",
  "team_id",
  "report_date",
  "start_time",
  "end_time",
  "shift",
  "furnace",
  "warehouse_check",
  "production_check",
  "created_by",
  "created_at",
];
const renderBadge = (
  value: unknown,
  options: { value: string; label: string; bg: string; text: string }[],
) => {
  const status = options.find((o) => String(o.value) === String(value)) ?? {
    label: String(value ?? "N/A"),
    bg: "#f5f5f5",
    text: "#616161",
  };
  return (
    <Box
      component="span"
      sx={{
        backgroundColor: status.bg,
        color: status.text,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: "0.7rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        display: "inline-block",
        minWidth: 64,
        textAlign: "center",
      }}
    >
      {status.label}
    </Box>
  );
};
