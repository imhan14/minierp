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
import Filters from "@components/Filters";
import DataTable, { type ActionConfig } from "@components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { productionReportSchema } from "@/schema/productionReport.schema";
import type { FieldConfig } from "@/types/FieldConfig";
import DynamicPopup from "@components/DynamicPopup";
import ProductionReportGeneralSection from "./components/ProductionReportGeneralSection";
import ProductListDetail from "./components/ProductListDetail";
import { useProductionReportData } from "./customHooks/useProductionReportData";
import { useProductionReportForm } from "./customHooks/useProductionReportForm";
import type { ProductionReportDisplay } from "@/types/ProductionReportType";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ProductionReportPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [rowId, setRowId] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductionReportDisplay | null>(null);
  const [editGeneral, setEditGeneral] =
    useState<ProductionReportDisplay | null>(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const { productionReports, error, loading, fetchProductionReport } =
    useProductionReportData(selectedDate, endDate);
  const { isSubmitting, handleAddNewReport } = useProductionReportForm(
    selectedDate,
    () => fetchProductionReport(selectedDate, endDate),
  );
  const productionReportColumns = useMemo(
    () => [
      { ...productionReportSchema.id },
      { ...productionReportSchema.team_name },
      {
        ...productionReportSchema.report_date,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("DD/MM/YYYY");
        }) as FieldConfig<ProductionReportDisplay>["render"],
      },
      { ...productionReportSchema.shift },
      { ...productionReportSchema.furnace },
      {
        ...productionReportSchema.start_time,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("HH:mm");
        }) as FieldConfig<ProductionReportDisplay>["render"],
      },
      {
        ...productionReportSchema.end_time,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("HH:mm");
        }) as FieldConfig<ProductionReportDisplay>["render"],
      },
      { id: "actions", label: "Actions" },
    ],
    [],
  );
  const handleOpenDetail = (row: ProductionReportDisplay) => {
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
  const actions = (): ActionConfig<ProductionReportDisplay>[] => {
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
              disabled={filterMode === "range"}
              variant="contained"
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
        {loading || isSubmitting ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            columns={productionReportColumns}
            data={productionReports}
            actions={actions}
            getRowKey={(row) => row.id}
          />
        )}
        <DynamicPopup
          open={openDetail}
          onClose={handleCloseDetail}
          title={`Details: #${selectedProduct?.id}`}
        >
          <ProductionReportGeneralSection
            selectedMaterial={selectedProduct}
            onSaveSuccess={() => fetchProductionReport(selectedDate, endDate)}
            editGeneral={editGeneral}
            onEditGeneral={setEditGeneral}
          />
          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Products List
            </Typography>
          </Divider>
          <ProductListDetail
            report_id={rowId}
            onSaveSuccess={() => fetchProductionReport(selectedDate, endDate)}
          />
        </DynamicPopup>
      </Box>
    </Box>
  );
};

export default ProductionReportPage;
