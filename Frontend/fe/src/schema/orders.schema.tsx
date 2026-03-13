import dayjs from "dayjs";
import type { FieldConfig } from "../types/FieldConfig";
import type { ProductOrderType } from "../types/ProductOrderType";
import { Box } from "@mui/material";

export interface OrderDisplay extends Omit<
  ProductOrderType,
  "teams" | "formulas"
> {
  formula_id: number;
  team_name: string;
  formula_name: string;
}
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
export const orderColumns: FieldConfig<OrderDisplay>[] = [
  { id: "id", label: "Id", width: 70 },
  {
    id: "order_date",
    label: "Date",
    width: 120,
    noWrap: true,
    render: ((value: string) => {
      if (!value) return "-";
      return dayjs(value).add(24, "hour").format("DD/MM/YYYY");
    }) as FieldConfig<OrderDisplay>["render"],
  },
  { id: "formula_name", label: "Formular", align: "center" },
  { id: "team_name", label: "Team Name", width: 150, align: "right" },
  { id: "product_shift", label: "Shift", align: "right" },
  { id: "target_quantity", label: "Quantity", align: "right" },
  { id: "urea_rate", label: "Urea", align: "right" },
  {
    id: "status",
    label: "Status",
    width: 120,
    align: "right",
    noWrap: true,
    render: renderStatus as FieldConfig<OrderDisplay>["render"],
  },
  { id: "input_temprature_1", label: "In °C 1", align: "right" },
  { id: "output_temprature_1", label: "Out °C 1", align: "right" },
  { id: "input_temprature_2", label: "In °C 2", align: "right" },
  { id: "output_temprature_2", label: "Out °C 2", align: "right" },
  { id: "actions", label: "Details", align: "center" },
];
