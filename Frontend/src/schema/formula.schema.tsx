import type { FormulaDisplay } from "@/types/FormulaType";
import type { FieldConfig } from "../types/FieldConfig";
import { Box } from "@mui/material";

export const ACTIVE_OPTIONS = [
  { value: "true", label: "Active", bg: "#e8f5e9", text: "#2e7d32" },
  { value: "false", label: "Inactive", bg: "#ffebee", text: "#c62828" },
];
export const PRODUCT_LINE_OPTIONS = [
  { label: "Trộn", value: "tron" },
  { label: "Sang Bao", value: "sangbao" },
  { label: "1 hạt", value: "mothat" },
];
export const SPEC_TYPE_OPTIONS = [
  { label: "25 Kg", value: "25Kg" },
  { label: "50 Kg", value: "50Kg" },
];
export const SPECIFICATION_OPTIONS = [
  { label: "Bao thành phẩm", value: "btp" },
];
export const COLOR_OPTIONS = [
  { label: "3 màu", value: "bamau" },
  { label: "Xám", value: "xam" },
];
const getLabel = (
  options: { label: string; value: string }[],
  value: string,
) => {
  return options.find((opt) => opt.value === value)?.label || value;
};

export const formulaSchema: Record<string, FieldConfig<FormulaDisplay>> = {
  id: { id: "id", label: "ID" },
  formula_code: { id: "formula_code", label: "Code" },
  formula_name: { id: "formula_name", label: "Formula Name" },
  product_id: { id: "product_id", label: "Product ID" },
  product_name: { id: "product_name", label: "Product Name" },
  is_active: {
    id: "is_active",
    label: "Active",
    options: ACTIVE_OPTIONS,
    render: (value) => {
      const status = ACTIVE_OPTIONS.find(
        (opt) => String(opt.value) === String(value),
      ) || { label: "N/A", bg: "#f5f5f5", text: "#616161" };

      return (
        <Box
          component="span"
          sx={{
            backgroundColor: status.bg,
            color: status.text,
            px: 0.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.7rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            minWidth: "80px",
            textAlign: "center",
          }}
        >
          {status.label}
        </Box>
      );
    },
  },
  product_line: {
    id: "product_line",
    label: "Product Line",
    options: PRODUCT_LINE_OPTIONS,
    render: (value) => getLabel(PRODUCT_LINE_OPTIONS, value as string),
  },
  specification: {
    id: "specification",
    label: "Specification",
    options: SPECIFICATION_OPTIONS,
    render: (value) => getLabel(SPECIFICATION_OPTIONS, value as string),
  },
  color: {
    id: "color",
    label: "Color",
    options: COLOR_OPTIONS,
    render: (value) => getLabel(COLOR_OPTIONS, value as string),
  },
  type_of_specification: {
    id: "type_of_specification",
    label: "Type Of Spec",
    options: SPEC_TYPE_OPTIONS,
    render: (value) => getLabel(SPEC_TYPE_OPTIONS, value as string),
  },
  created_by: { id: "created_by", label: "Created By" },
};
