import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Filters from "../../components/Filters";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DataTable, { type ActionConfig } from "../../components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DynamicPopup from "../../components/DynamicPopup";
import type { FieldConfig } from "../../types/FieldConfig";
import { materialReportSchema } from "../../schema/materialReport.schema";
import type { MaterialReportDisplay } from "../../schema/materialReport.schema";
import MaterialReportGeneralSection from "./components/MaterialReportGeneralSection";
import MaterialDetailList from "./components/MaterialDetailList";
import OtherIngredient from "./components/OtherIngredient";
import { useMaterialReportData } from "./customHooks/useMaterialReportData";
import useMaterialReportForm from "./customHooks/useMaterialReportForm";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const MaterialReportPage = () => {
  const [rowId, setRowId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialReportDisplay | null>(null);
  const [editGeneral, setEditGeneral] = useState<MaterialReportDisplay | null>(
    null,
  );
  const { loading, error, materialReports, getMaterialReport } =
    useMaterialReportData(selectedDate);
  const { handleAddNewReport } = useMaterialReportForm(selectedDate, () =>
    getMaterialReport(selectedDate),
  );

  const materialReportColumns = useMemo(
    () => [
      { ...materialReportSchema.id },
      { ...materialReportSchema.team_name },
      {
        ...materialReportSchema.report_date,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("DD/MM/YYYY");
        }) as FieldConfig<MaterialReportDisplay>["render"],
      },
      { ...materialReportSchema.shift },
      {
        ...materialReportSchema.start_time,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("HH:mm");
        }) as FieldConfig<MaterialReportDisplay>["render"],
      },
      {
        ...materialReportSchema.end_time,
        render: ((value: string) => {
          if (!value) return "-";
          return dayjs(value).format("HH:mm");
        }) as FieldConfig<MaterialReportDisplay>["render"],
      },
      { id: "actions", label: "Actions" },
    ],
    [],
  );

  const handleOpenDetail = (row: MaterialReportDisplay) => {
    setSelectedMaterial(row);
    setEditGeneral(row);
    setOpenDetail(true);
    setRowId(row.id);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setTimeout(() => {
      setSelectedMaterial(null);
    }, 300);
  };

  const actions = (): ActionConfig<MaterialReportDisplay>[] => {
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
      <Filters selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Box>
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
            columns={materialReportColumns}
            data={materialReports}
            actions={actions}
            getRowKey={(row) => row.id}
          />
        )}
        <DynamicPopup
          open={openDetail}
          onClose={handleCloseDetail}
          title={`Details: #${selectedMaterial?.id}`}
          // enableSend={true}
        >
          <MaterialReportGeneralSection
            selectedMaterial={selectedMaterial}
            onSaveSuccess={() => getMaterialReport(selectedDate)}
            editGeneral={editGeneral}
            onEditGeneral={setEditGeneral}
          />
          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Ingredient List (Editable)
            </Typography>
          </Divider>
          <MaterialDetailList material_id={rowId} />
          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Other Ingredient
            </Typography>
          </Divider>
          <OtherIngredient
            material_id={selectedMaterial?.id}
            extral_material={selectedMaterial}
            onSaveSuccess={() => getMaterialReport(selectedDate)}
          />
        </DynamicPopup>
      </Box>
    </Box>
  );
};

export default MaterialReportPage;
