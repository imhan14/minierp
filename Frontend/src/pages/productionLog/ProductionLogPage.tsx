import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Filters from "@/components/Filters";
import DataTable, { type ActionConfig } from "@components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import type { FieldConfig } from "@/types/FieldConfig";
import DynamicPopup from "../../components/DynamicPopup";
import type { ProductionLogDisplay } from "@/types/ProductionLogType";
import { useProductionLogData } from "./customHooks/useProductionLogData";
import { productionLogSchema } from "@/schema/productionLog.schema";
import { useProductionLogForm } from "./customHooks/useProductionLogForm";
import ProductionLogGeneral from "./components/ProductionLogGeneral";
import ProductionLogDetail from "./components/ProductionLogDetail";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ProductionLogPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [rowId, setRowId] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductionLogDisplay | null>(null);
  const [editGeneral, setEditGeneral] = useState<ProductionLogDisplay | null>(
    null,
  );
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const { error, loading, productionLog, fetchProductionLog } =
    useProductionLogData(selectedDate, endDate);
  const { handleAddNewReport } = useProductionLogForm(selectedDate, () =>
    fetchProductionLog(selectedDate, endDate),
  );
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const productionLogColumns = useMemo(
    () => [
      { ...productionLogSchema.id },
      { ...productionLogSchema.team_name },
      {
        ...productionLogSchema.log_date,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("DD/MM/YYYY");
        }) as FieldConfig<ProductionLogDisplay>["render"],
      },
      { ...productionLogSchema.on_work },
      {
        ...productionLogSchema.log_start,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("HH:mm");
        }) as FieldConfig<ProductionLogDisplay>["render"],
      },
      {
        ...productionLogSchema.log_end,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("HH:mm");
        }) as FieldConfig<ProductionLogDisplay>["render"],
      },
      { id: "actions", label: "Actions" },
    ],
    [],
  );

  const handleOpenDetail = (row: ProductionLogDisplay) => {
    setSelectedProduct(row);
    setEditGeneral(row);
    setOpenDetail(true);
    setRowId(row.id);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

  const actions = (): ActionConfig<ProductionLogDisplay>[] => {
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
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        mode={filterMode}
        setMode={setFilterMode}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <Box sx={{}}>
        {currentUser.role < 8 && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              disabled={filterMode === "range"}
              sx={{ marginBottom: 1 }}
              onClick={handleAddNewReport}
            >
              Add new Report
            </Button>
            {filterMode === "range" && (
              <Typography sx={{ color: "red" }} variant="subtitle2">
                *Add button only available on Single Mode
              </Typography>
            )}
          </Box>
        )}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            columns={productionLogColumns}
            data={productionLog}
            actions={actions}
            getRowKey={(row) => row.id}
          />
        )}
        <DynamicPopup
          open={openDetail}
          onClose={handleCloseDetail}
          title={`Details: #${selectedProduct?.id}`}
        >
          <ProductionLogGeneral
            selectedLog={selectedProduct}
            onSaveSuccess={() => fetchProductionLog(selectedDate, endDate)}
            editGeneral={editGeneral}
            onEditGeneral={setEditGeneral}
          />

          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Products List
            </Typography>
          </Divider>
          <ProductionLogDetail
            log_id={rowId}
            onSaveSuccess={() => fetchProductionLog(selectedDate, endDate)}
          />
        </DynamicPopup>
      </Box>
    </Box>
  );
};

export default ProductionLogPage;
