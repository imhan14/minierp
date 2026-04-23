import dayjs from "dayjs";
import type { FieldConfig } from "../types/FieldConfig";
import { Box } from "@mui/material";
import type { OrderDisplay } from "../types/ProductOrderType";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  ok: { bg: "#e8f5e9", text: "#2e7d32", label: "Hoàn tất" },
  pending: { bg: "#ffd7b5", text: "#ff6700", label: "Đang đợi" },
  cancel: { bg: "#ffebee", text: "#d32f2f", label: "Đã hủy" },
  default: { bg: "#f5f5f5", text: "#616161", label: "N/A" },
};

const renderStatus = (status: string) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.default;
  return (
    <Box
      component="span"
      sx={{
        backgroundColor: style.bg,
        color: style.text,
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: "0.75rem",
        fontWeight: "bold",
        textTransform: "uppercase",
      }}
    >
      {style.label}
    </Box>
  );
};

export const orderColumnSchema: Record<string, FieldConfig<OrderDisplay>> = {
  id: { id: "id", label: "Id" },
  order_date: {
    id: "order_date",
    label: "Date",
    // width: 120,
    noWrap: true,
    isReadOnly: true,
    render: ((value: string) => {
      if (!value) return "-";
      return dayjs(value).format("DD/MM/YYYY");
    }) as FieldConfig<OrderDisplay>["render"],
  },
  formula_name: { id: "formula_name", label: "Formular", align: "center" },
  formula_id: { id: "formula_id", label: "Formula ID" },
  team_name: {
    id: "team_name",
    label: "Team Name",
  },
  team_id: {
    id: "team_id",
    label: "Team ID",
  },
  product_shift: { id: "product_shift", label: "Shift", align: "right" },
  target_quantity: { id: "target_quantity", label: "Quantity", align: "right" },
  urea_rate: { id: "urea_rate", label: "Urea", align: "right" },
  status: {
    id: "status",
    label: "Status",
    align: "right",
    noWrap: true,
    isReadOnly: true,
    render: renderStatus as FieldConfig<OrderDisplay>["render"],
  },
  input_temprature_1: {
    id: "input_temprature_1",
    label: "In °C 1",
    align: "right",
  },
  output_temprature_1: {
    id: "output_temprature_1",
    label: "Out °C 1",
    align: "right",
  },
  input_temprature_2: {
    id: "input_temprature_2",
    label: "In °C 2",
    align: "right",
  },
  output_temprature_2: {
    id: "output_temprature_2",
    label: "Out °C 2",
    align: "right",
  },
};
