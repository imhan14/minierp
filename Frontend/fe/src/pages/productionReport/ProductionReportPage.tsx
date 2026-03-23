import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Filters from "../../components/Filters";
import DataTable, { type ActionConfig } from "../../components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  productionReportSchema,
  type ProductionReportDisplay,
} from "../../schema/productionReport.schema";
import type { FieldConfig } from "../../types/FieldConfig";
import {
  fetchAddNewReport,
  fetchProductionReportData,
} from "./dataProductionReport";
import DynamicPopup from "../../components/DynamicPopup";
import ProductionReportGeneralSection from "./components/ProductionReportGeneralSection";
import ProductListDetail from "./components/ProductListDetail";

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
  const [productionReports, setProductionReports] = useState<
    ProductionReportDisplay[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductionReportDisplay | null>(null);
  const [editGeneral, setEditGeneral] =
    useState<ProductionReportDisplay | null>(null);
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
  const handleAddNewReport = async () => {
    try {
      setLoading(true);
      await fetchAddNewReport(selectedDate);
      await fetchProductionReport(selectedDate);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
  const fetchProductionReport = useCallback(async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      setProductionReports(await fetchProductionReportData(date));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProductionReport(selectedDate);
  }, [selectedDate, fetchProductionReport]);
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
      <Box sx={{}}>
        <Button
          variant="contained"
          sx={{ marginBottom: 1 }}
          onClick={handleAddNewReport}
        >
          Add new Report
        </Button>
        {loading ? (
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
          enableSend={true}
        >
          <ProductionReportGeneralSection
            selectedMaterial={selectedProduct}
            onSaveSuccess={() => fetchProductionReport(selectedDate)}
            editGeneral={editGeneral}
            onEditGeneral={setEditGeneral}
          />
          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Products List
            </Typography>
          </Divider>
          <ProductListDetail
            product_id={rowId}
            onSaveSuccess={() => console.log("")}
          />
          {/* <MaterialDetailList material_id={rowId} />
          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Other Ingredient
            </Typography>
          </Divider>
          <OtherIngredient
            material_id={selectedMaterial?.id}
            extral_material={selectedMaterial}
            onSaveSuccess={() => fetchMaterialReport(selectedDate)}
          /> */}
        </DynamicPopup>
      </Box>
    </Box>
  );
};

export default ProductionReportPage;
