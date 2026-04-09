import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import DataTable, { type ActionConfig } from "../components/DataTable";
import type { FieldConfig } from "../types/FieldConfig";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Filters from "../components/Filters";
import type { ProductOrderType } from "../types/ProductOrderType";
import type { FormulaDetailType } from "../types/FormulaDetailType";
import DynamicPopup from "../components/DynamicPopup";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import productOrderApi from "../apis/productOrderApi";
import formulaDetailApi from "../apis/formulaDetailApi";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
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

const Dashboard = () => {
  // const [orders, setOrders] = useState<OrderDisplay[]>([]);
  // const [formula, setFormula] = useState<FormulaDetailDisplay[]>([]);
  // const [openDetail, setOpenDetail] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [detailLoading, setDetailLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // const formulaColumns: FieldConfig<FormulaDetailDisplay>[] = [
  //   { id: "ingredient_name", label: "Ingredient Name" },
  //   { id: "unit", label: "Unit" },
  //   { id: "standard_quality", label: "Quantity" },
  // ];

  // const handleOpenDetail = (row: OrderDisplay) => {
  //   setSelectedOrder(row);
  //   fetchFormulaDetail(row.formula_id);
  //   setOpenDetail(true);
  // };
  // const handleCloseDetail = () => {
  //   setOpenDetail(false);
  //   setTimeout(() => {
  //     setSelectedOrder(null);
  //     setFormula([]);
  //   }, 300);
  // };

  // const actions = (): ActionConfig<OrderDisplay>[] => {
  //   return [
  //     {
  //       label: "Details",
  //       color: "primary",
  //       icon: <RemoveRedEyeOutlinedIcon />,
  //       onClick: (row) => handleOpenDetail(row),
  //     },
  //   ];
  // };

  // const displayFields = orderColumns.filter(
  //   (col) => col.id !== "id" && col.id !== "actions",
  // );

  // const fetchOrders = async (date?: Dayjs | null) => {
  //   try {
  //     setLoading(true);
  //     const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
  //     const response = await productOrderApi.getAllOrders({ date: dateParam });
  //     const formattedData: OrderDisplay[] = response.data.map((item) => {
  //       const { teams, formulas, ...rest } = item;
  //       return {
  //         ...rest,
  //         formula_id: formulas?.id,
  //         team_id: teams?.id,
  //         team_name: teams?.team_name || "N/A",
  //         formula_name: formulas?.formula_name || "N/A",
  //       };
  //     });

  //     setOrders(formattedData);
  //     setError(null);
  //   } catch (err) {
  //     setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!");
  //     console.error("API Error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchFormulaDetail = async (formulaId: number) => {
  //   try {
  //     setDetailLoading(true);
  //     const response = await formulaDetailApi.getAllFormulaDetails({
  //       formula_id: formulaId,
  //     });
  //     const formattedData: FormulaDetailDisplay[] = response.data.map(
  //       (item) => {
  //         const { ingredients, ...rest } = item;
  //         return {
  //           ...rest,
  //           ingredient_name: ingredients?.ingredient_name,
  //           unit: ingredients?.unit,
  //         };
  //       },
  //     );

  //     setFormula(formattedData);
  //     setError(null);
  //   } catch (err) {
  //     setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!");
  //     console.error("API Error:", err);
  //   } finally {
  //     setDetailLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchOrders(selectedDate);
  // }, [selectedDate]);

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }
  return (
    <Box>
      {/* <DrawerHeader />
      <Filters selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={orderDetail}
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
            {detailLoading ? (
              <Stack spacing={1}>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="rounded" height={60} />
                <Skeleton variant="rounded" height={60} />
              </Stack>
            ) : (
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
            )}

            <Divider sx={{ my: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Formular List (Formular)
              </Typography>
            </Divider>
            {detailLoading ? (
              <Stack spacing={1}>
                <Skeleton variant="rounded" height={600} />
              </Stack>
            ) : (
              <DataTable
                columns={formulaColumns}
                data={formula}
                getRowKey={(row) => row.id}
              />
            )}
          </Box>
        )}
      </DynamicPopup> */}
    </Box>
  );
};

export default Dashboard;
