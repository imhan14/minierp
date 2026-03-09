import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
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
import type { FormulaDetailType } from "../types/FormulaDetailType";
import DynamicPopup from "../components/DynamicPopup";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
export interface OrderDisplay extends Omit<
  ProductOrderType,
  "teams" | "formulas"
> {
  formula_id: number;
  team_name: string;
  formula_name: string;
}
interface FormulaDetailDisplay extends Omit<FormulaDetailType, "ingredients"> {
  ingredient_name: string;
  unit: string;
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
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   textAlign: "center",
//   color: (theme.vars ?? theme).palette.text.secondary,
//   ...theme.applyStyles("dark", {
//     backgroundColor: "#1A2027",
//   }),
// }));
const OrderPage = () => {
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [formula, setFormula] = useState<FormulaDetailDisplay[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);
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
    { id: "input_temprature_1", label: "In °C 1", align: "right" },
    { id: "output_temprature_1", label: "Out °C 1", align: "right" },
    { id: "input_temprature_2", label: "In °C 2", align: "right" },
    { id: "output_temprature_2", label: "Out °C 2", align: "right" },
    { id: "actions", label: "Details", align: "center" },
  ];

  const formulaColumns: ColumnConfig<FormulaDetailDisplay>[] = [
    // { id: "id", label: "id" },
    { id: "ingredient_name", label: "Ingredient Name" },
    { id: "unit", label: "Unit" },
    { id: "standard_quality", label: "Quantity" },
  ];

  const handleOpenDetail = (row: OrderDisplay) => {
    setSelectedOrder(row);
    fetchFormulaDetail(row.formula_id);
    // console.log(row.formula_id);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };
  const actions: ActionConfig<OrderDisplay>[] = [
    {
      label: "Details",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: (row) => handleOpenDetail(row),
    },
  ];

  const displayFields = orderColumns.filter(
    (col) => col.id !== "id" && col.id !== "actions",
  );

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

  const fetchFormulaDetail = async (formulaId: number) => {
    try {
      setLoading(true);
      const response = await api.get<FormulaDetailType[]>(`/formula-detail`, {
        params: { formula_id: formulaId },
      });
      const formattedData: FormulaDetailDisplay[] = response.data.map(
        (item) => {
          const { ingredients, ...rest } = item;
          return {
            ...rest,
            ingredient_name: ingredients?.ingredient_name,
            unit: ingredients?.unit,
          };
        },
      );
      console.log(response.data);
      setFormula(formattedData);
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
      <DynamicPopup
        open={openDetail}
        onClose={handleCloseDetail}
        title={`Details: #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              General
            </Typography>

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {displayFields.map((col) => {
                const value = selectedOrder[col.id as keyof OrderDisplay];
                return (
                  // <Grid key={col.id} size={{ xs: 2, sm: 4, md: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 1.5, bgcolor: "#f1f5f9", borderStyle: "dashed" }}
                  >
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {col.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5, color: "#1e293b" }}
                    >
                      {col.render
                        ? col.render(value, selectedOrder)
                        : String(value ?? "N/A")}
                    </Typography>
                  </Paper>
                  // </Grid>
                );
              })}
            </Grid>

            <Divider sx={{ my: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Danh sách nguyên liệu (Formular)
              </Typography>
            </Divider>

            <DataTable
              columns={formulaColumns}
              data={formula}
              getRowKey={(row) => row.id}
            />
          </Box>
        )}
      </DynamicPopup>
      {/* <PopupDetailFormula
        openDetail={openDetail}
        selectedOrder={selectedOrder}
        onCloseDetail={handleCloseDetail}
      /> */}
      {/* <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Details: #{selectedOrder?.id}
          <IconButton onClick={handleCloseDetail} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography>General</Typography>
          <Divider />
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {orderColumns.map((item) => (
              <Grid key={item.id} size={{ xs: 2, sm: 4, md: 4 }}>
                <Item>
                  {item.label}
                  <Typography>asd</Typography>
                </Item>
              </Grid>
            ))}
          </Grid>
          <Divider />
          <DataTable
            columns={formulaColumns}
            data={formula}
            // actions={actions}
            getRowKey={(row) => row.id}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDetail}
            color="inherit"
            variant="outlined"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default OrderPage;
