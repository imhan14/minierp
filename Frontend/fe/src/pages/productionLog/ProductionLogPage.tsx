import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Filters from "../../components/Filters";
import DataTable, { type ActionConfig } from "../../components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import type { FieldConfig } from "../../types/FieldConfig";

import DynamicPopup from "../../components/DynamicPopup";
import type { ProductionLogDisplay } from "../../types/ProductionLogType";
import { useProductionLogData } from "./customHooks/useProductionLogData";
import { productionLogSchema } from "../../schema/productionLog.schema";
import { useProductionLogForm } from "./customHooks/useProductionLogForm";
import ProductionLogGeneral from "./components/ProductionLogGeneral";

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
  const { error, loading, productionLog, fetchProductionLog } =
    useProductionLogData();
  const { handleAddNewReport } = useProductionLogForm(selectedDate, () =>
    fetchProductionLog(selectedDate),
  );

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

  useEffect(() => {
    fetchProductionLog(selectedDate);
  }, [selectedDate, fetchProductionLog]);
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
            onSaveSuccess={() => fetchProductionLog(selectedDate)}
            editGeneral={editGeneral}
            onEditGeneral={setEditGeneral}
          />

          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Products List
            </Typography>
          </Divider>
          {/* <ProductListDetail
            report_id={rowId}
            onSaveSuccess={() => fetchProductionReport(selectedDate)}
          /> */}
        </DynamicPopup>
      </Box>
    </Box>
  );
};

export default ProductionLogPage;
