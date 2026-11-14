import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import utc from "dayjs/plugin/utc";
import type { OrderDisplay } from "@/types/ProductOrderType";
import type { FormulaDetailDisplay } from "@/types/FormulaDetailType";
import type { FieldConfig } from "@/types/FieldConfig";
import type { ActionConfig } from "@components/DataTable";
import Filters from "@components/Filters";
import PermissionGate from "@components/PermissionGate";
import DataTable from "@components/DataTable";
import DynamicPopup from "@components/DynamicPopup";
import { useOrderData } from "./customHooks/useOrderData";
import { useOrderForm } from "./customHooks/useOrderForm";
import OrderGeneral from "./components/OrderGeneral";
import { orderColumnSchema } from "@/schema/orders.schema";
import { useNotify } from "@/hooks/useNotify";

dayjs.extend(utc);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const OrderPage = () => {
  const notify = useNotify();
  const [openDetail, setOpenDetail] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [editGeneral, setEditGeneral] = useState<OrderDisplay | null>(null);
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const {
    detailLoading,
    error,
    fetchFormulaDetail,
    formula,
    loading,
    orders,
    setFormula,
    fetchOrders,
  } = useOrderData(selectedDate, endDate);
  const { isSubmitting, handleCreateOrder: createOrder } = useOrderForm(
    selectedDate,
    () => fetchOrders(selectedDate, endDate),
  );
  const orderColumns = useMemo(
    () => [
      { ...orderColumnSchema.id },
      {
        ...orderColumnSchema.order_date,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("DD/MM/YYYY");
        }) as FieldConfig<OrderDisplay>["render"],
      },
      { ...orderColumnSchema.formula_name },
      { ...orderColumnSchema.team_name },
      { ...orderColumnSchema.product_shift },
      { ...orderColumnSchema.status },
      { ...orderColumnSchema.target_quantity },
      { id: "actions", label: "Actions" },
    ],
    [],
  );
  const formulaColumns: FieldConfig<FormulaDetailDisplay>[] = [
    // { id: "id", label: "id" },
    { id: "ingredient_name", label: "Ingredient Name" },
    { id: "unit", label: "Unit" },
    { id: "standard_quality", label: "Quantity" },
  ];

  const handleOpenDetail = (row: OrderDisplay) => {
    setSelectedOrder(row);
    setEditGeneral(row);
    if (row.formula_id) fetchFormulaDetail(row.formula_id);
    setOpenDetail(true);
  };
  const handleOpenCreate = () => {
    const draft: OrderDisplay = {
      id: 0,
      order_date:
        selectedDate?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
      formula_id: 0,
      formula_name: "",
      team_id: 0,
      team_name: "",
      product_shift: "",
      target_quantity: 0,
      urea_rate: null,
      status: "pending",
      input_temprature_1: 0,
      output_temprature_1: 0,
      input_temprature_2: 0,
      output_temprature_2: 0,
      order_note: "",
      created_at: "",
      created_by: 0,
    };
    setSelectedOrder(draft);
    setEditGeneral(draft);
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    if (isSubmitting) return;
    setOpenCreate(false);
    setSelectedOrder(null);
    setEditGeneral(null);
  };
  const handleSubmitCreate = async () => {
    if (
      !editGeneral?.formula_id ||
      !editGeneral.team_id ||
      !editGeneral.product_shift ||
      !editGeneral.target_quantity ||
      editGeneral.target_quantity <= 0
    ) {
      notify("Vui lòng điền công thức, tổ, ca và sản lượng hợp lệ.", "error");
      return;
    }
    const created = await createOrder({
      formula_id: Number(editGeneral.formula_id),
      team_id: Number(editGeneral.team_id),
      product_shift: editGeneral.product_shift,
      target_quantity: Number(editGeneral.target_quantity),
      urea_rate: editGeneral.urea_rate ?? undefined,
      order_note: editGeneral.order_note || undefined,
    });
    if (created) handleCloseCreate();
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setTimeout(() => {
      setSelectedOrder(null);
      setFormula([]);
    }, 300);
  };

  const actions = (): ActionConfig<OrderDisplay>[] => {
    return [
      {
        label: "Details",
        color: "primary",
        icon: <RemoveRedEyeOutlinedIcon />,
        onClick: (row) => handleOpenDetail(row),
      },
    ];
  };

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
      <Filters
        showDateFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        mode={filterMode}
        setMode={setFilterMode}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <PermissionGate allowedRoles={[1, 2, 3, 4, 5]}>
          <Button
            variant="contained"
            sx={{ marginBottom: 1 }}
            onClick={handleOpenCreate}
          >
            Add new Order
          </Button>
        </PermissionGate>
      </Box>
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
        open={openCreate}
        onClose={handleCloseCreate}
        title="Tạo lệnh sản xuất"
        mode="add"
        onSubmit={handleSubmitCreate}
        isSubmitting={isSubmitting}
      >
        <OrderGeneral
          selectedOrder={selectedOrder}
          editGeneral={editGeneral}
          onEditGeneral={setEditGeneral}
          onSaveSuccess={() => undefined}
          mode="form"
        />
      </DynamicPopup>
      <DynamicPopup
        open={openDetail}
        onClose={handleCloseDetail}
        title={`Details: #${selectedOrder?.id}`}
      >
        <OrderGeneral
          selectedOrder={selectedOrder}
          onSaveSuccess={() => fetchOrders(selectedDate, endDate)}
          editGeneral={editGeneral}
          onEditGeneral={setEditGeneral}
        />
        {selectedOrder && (
          <Box>
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
                getRowKey={(row) => Number(row.id)}
              />
            )}
          </Box>
        )}
      </DynamicPopup>
    </Box>
  );
};

export default OrderPage;
