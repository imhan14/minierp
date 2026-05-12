import type { FormulaType } from "@/schema/formula.schema";
import type { FieldConfig } from "@/types/FieldConfig";
import { Box } from "@mui/material";
import {
  ACTIVE_OPTIONS,
  COLOR_OPTIONS,
  PRODUCT_LINE_OPTIONS,
  SPEC_TYPE_OPTIONS,
  SPECIFICATION_OPTIONS,
} from "./formula.constant";
const getLabel = (
  options: { label: string; value: string }[],
  value: unknown,
) =>
  options.find((o) => o.value === String(value))?.label ?? String(value ?? "-");

// ─── Field configs (UI layer) ─────────────────────────────────────────────────
export const FORMULA_FIELD_CONFIGS: Partial<
  Record<keyof FormulaType, FieldConfig<FormulaType>>
> = {
  formula_code: {
    id: "formula_code",
    label: "Mã công thức",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  formula_name: {
    id: "formula_name",
    label: "Tên công thức",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  product_id: {
    id: "product_id",
    label: "Mã sản phẩm",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  product_name: {
    id: "product_name",
    label: "Tên sản phẩm",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    isReadOnly: true,
    required: true,
  },

  // ── Badge ──────
  is_active: {
    id: "is_active",
    label: "Trạng thái",
    inputType: "select",
    options: ACTIVE_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => renderBadge(value, ACTIVE_OPTIONS),
  },
  product_line: {
    id: "product_line",
    label: "Product Line",
    inputType: "select",
    options: PRODUCT_LINE_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => getLabel(PRODUCT_LINE_OPTIONS, value),
    required: true,
  },
  specification: {
    id: "specification",
    label: "Specification",
    inputType: "select",
    options: SPECIFICATION_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => getLabel(SPECIFICATION_OPTIONS, value),
  },
  color: {
    id: "color",
    label: "Color",
    inputType: "select",
    options: COLOR_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => getLabel(COLOR_OPTIONS, value),
  },
  type_of_specification: {
    id: "type_of_specification",
    label: "Type Of Spec",
    inputType: "select",
    options: SPEC_TYPE_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => getLabel(SPEC_TYPE_OPTIONS, value),
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

// ───Preset field lists──────────────────────────────────────

/** DataTable */
export const FORMULA_TABLE_FIELDS: (keyof FormulaType)[] = [
  "formula_code",
  "formula_name",
  "product_name",
  "is_active",
  "product_line",
];

export const FORMULA_ADD_FIELDS: (keyof FormulaType)[] = [
  "formula_name",
  "product_id",
  "product_line",
  "specification",
  "color",
  "type_of_specification",
];

export const FORMULA_EDIT_FIELDS: (keyof FormulaType)[] = [
  "formula_code",
  "formula_name",
  "product_id",
  "is_active",
  "product_line",
  "specification",
  "color",
  "type_of_specification",
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
