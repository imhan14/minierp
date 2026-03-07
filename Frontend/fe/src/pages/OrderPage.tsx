import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import DataTable, {
  type ColumnConfig,
  type ActionConfig,
} from "../components/DataTable";
import api from "../apis/axios";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Filters from "../components/Filters";
import type { ProductOrderType } from "../types/ProductOrderType";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
interface OrderDisplay extends Omit<ProductOrderType, "teams" | "formulas"> {
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

const OrderPage = () => {
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

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
  const orderColumns: ColumnConfig<OrderDisplay>[] = [
    { id: "id", label: "Id", width: 70 },
    {
      id: "order_date",
      label: "Date",
      width: 120,
      noWrap: true,
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("DD/MM/YYYY");
      }) as ColumnConfig<OrderDisplay>["render"],
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
      render: renderStatus as ColumnConfig<OrderDisplay>["render"],
    },
    { id: "input_temprature_1", label: "In Temp 1", align: "right" },
    { id: "output_temprature_1", label: "Out Temp 1", align: "right" },
    { id: "input_temprature_2", label: "In Temp 2", align: "right" },
    { id: "output_temprature_2", label: "Out Temp 2", align: "right" },
    { id: "actions", label: "Details", align: "center" },
  ];
  const actions: ActionConfig<OrderDisplay>[] = [
    {
      label: "Details",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: (row) => console.log("Detail of:", row.id),
    },
  ];

  const fetchOrders = async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
      const response = await api.get<ProductOrderType[]>(`/product-order`, {
        params: { date: dateParam },
      });
      const formattedData: OrderDisplay[] = response.data.map((item) => {
        const { teams, formulas, ...rest } = item;
        return {
          ...rest,
          formula_id: formulas?.id,
          team_id: teams?.id,
          team_name: teams?.team_name || "N/A",
          formula_name: formulas?.formula_name || "N/A",
        };
      });

      setOrders(formattedData);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <DrawerHeader />
      <Filters selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={orderColumns}
          data={orders}
          actions={actions}
          getRowKey={(row) => row.id}
        />
      )}
    </Box>
  );
};

export default OrderPage;
