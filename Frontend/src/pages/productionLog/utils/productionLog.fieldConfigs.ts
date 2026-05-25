import type { ProductionLogType } from "@/schema/productionLog.schema";
import type { FieldConfig } from "@/types/FieldConfig";
import dayjs from "dayjs";

export const PRODUCTION_LOG_FIELD_CONFIGS: Partial<
  Record<keyof ProductionLogType, FieldConfig<ProductionLogType>>
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
  log_date: {
    id: "log_date",
    label: "Ngày",
    inputType: "datetime-local",
    gridSize: { xs: 12, sm: 6 },
    required: true,
    render: (value) =>
      value ? dayjs(value as string).format("DD/MM/YYYY") : "-",
  },
  log_start: {
    id: "log_start",
    label: "Bắt đầu",
    inputType: "datetime-local",
    gridSize: { xs: 12, sm: 6 },
    required: true,
    render: (value) =>
      value ? dayjs(value as string).format("HH:mm DD/MM") : "-",
  },
  log_end: {
    id: "log_end",
    label: "Kết thúc",
    inputType: "datetime-local",
    gridSize: { xs: 12, sm: 6 },
    render: (value) =>
      value ? dayjs(value as string).format("HH:mm DD/MM") : "-",
  },
  on_work: {
    id: "on_work",
    label: "Đang làm",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
  },
  number_of_employee: {
    id: "number_of_employee",
    label: "Số NV",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
  },
  unauthorized_absence: {
    id: "unauthorized_absence",
    label: "Không phép",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  authorized_absence: {
    id: "authorized_absence",
    label: "Có phép",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  shift_leader: {
    id: "shift_leader",
    label: "Trưởng ca",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  forklift: {
    id: "forklift",
    label: "Xe nâng",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  ht_di: {
    id: "ht_di",
    label: "HT đi",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  ht_den: {
    id: "ht_den",
    label: "HT đến",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  electric_production: {
    id: "electric_production",
    label: "Điện SX",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
  },
  electric_mix: {
    id: "electric_mix",
    label: "Điện trộn",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
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
export const PRODUCTION_LOG_TABLE_FIELDS: (keyof ProductionLogType)[] = [
  "team_name",
  "log_date",
  "log_start",
  "log_end",
];

/** Add New */
export const PRODUCTION_LOG_ADD_FIELDS: (keyof ProductionLogType)[] = [
  "team_id",
  // "team_name",
  "log_date",
  "log_start",
  "log_end",
  "on_work",
  "number_of_employee",
  "unauthorized_absence",
  "authorized_absence",
  "shift_leader",
  "forklift",
  "ht_di",
  "ht_den",
  "electric_production",
  "electric_mix",
];

/** Edit */
export const PRODUCTION_LOG_EDIT_FIELDS: (keyof ProductionLogType)[] = [
  // "team_name",
  "team_id",
  "log_date",
  "log_start",
  "log_end",
  "on_work",
  "number_of_employee",
  "unauthorized_absence",
  "authorized_absence",
  "shift_leader",
  "forklift",
  "ht_di",
  "ht_den",
  "electric_production",
  "electric_mix",
  "created_by",
  "created_at",
];
