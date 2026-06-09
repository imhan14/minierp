import { SHIFT_OPTIONS } from "@/pages/productionReport/utils/productionReport.constant";
import type {
  ExtraMaterialsJson,
  MaterialReportType,
} from "@/schema/materialReport.schema";
import type { FieldConfig } from "@/types/FieldConfig";
import { getLabel } from "@/utils/render";
import dayjs from "dayjs";

// ─── Field configs (UI layer) ─────────────────────────────────────────────────
export const MATERIAL_REPORT_FIELD_CONFIGS: Partial<
  Record<keyof MaterialReportType, FieldConfig<MaterialReportType>>
> = {
  // id: {
  //   id: "id",
  //   label: "ID",
  //   inputType: "number",
  // },
  team_id: {
    id: "team_id",
    label: "team id",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  team_name: {
    id: "team_name",
    label: "Tổ",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  report_date: {
    id: "report_date",
    label: "Ngày BC",
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
  shift: {
    id: "shift",
    label: "Ca",
    inputType: "select",
    options: SHIFT_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => getLabel(SHIFT_OPTIONS, value),
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
  // extral_materials: {
  //   id: "extral_materials",
  //   label: "Nguyên liệu phụ",
  //   inputType: "custom",
  //   gridSize: { xs: 12 },
  //   render: (value) => {
  //     const items = value;
  //     return items ? `${items.length} nguyên liệu` : "Không có";
  //   },
  // },
};

// ───Preset field lists──────────────────────────────────────

/** DataTable */
export const MATERIAL_REPORT_TABLE_FIELDS: (keyof MaterialReportType)[] = [
  "team_name",
  "report_date",
  "start_time",
  "end_time",
];

export const MATERIAL_REPORT_ADD_FIELDS: (keyof MaterialReportType)[] = [
  "team_id",
  "report_date",
  "shift",
];

export const MATERIAL_REPORT_EDIT_FIELDS: (keyof MaterialReportType)[] = [
  "team_id",
  "report_date",
  "start_time",
  "end_time",
  "shift",
  // "extral_materials",
  "created_by",
  "created_at",
];

export const EXTRA_MATERIALS_FIELD_CONFIGS: Partial<
  Record<keyof ExtraMaterialsJson, FieldConfig<ExtraMaterialsJson>>
> = {
  id: { id: "id", label: "id" },
  ingredient_name: { id: "ingredient_name", label: "Tên nguyên liệu" },
  weight: { id: "weight", label: "Khối lượng" },
  real_percent: { id: "real_percent", label: "Tỉ lệ thực" },
  note: { id: "note", label: "Ghi chú" },
};
