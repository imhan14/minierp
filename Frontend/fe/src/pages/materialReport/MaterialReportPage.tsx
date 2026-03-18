import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Filters from "../../components/Filters";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DataTable, { type ActionConfig } from "../../components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DynamicPopup from "../../components/DynamicPopup";
import type { FieldConfig } from "../../types/FieldConfig";
import { materialReportSchema } from "../../schema/materialReport.schema";
import { fetchMaterialReportData } from "./dataMaterialReport";
import type { MaterialReportDisplay } from "../../schema/materialReport.schema";
import MaterialReportGeneralSection from "./components/MaterialReportGeneralSection";
import MaterialDetailList from "./components/MaterialDetailList";
import OtherIngredient from "./components/OtherIngredient";

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
  const [materialReports, setMaterialReports] = useState<
    MaterialReportDisplay[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialReportDisplay | null>(null);
  const [editGeneral, setEditGeneral] = useState<MaterialReportDisplay | null>(
    null,
  );

  const columns = [
    { ...materialReportSchema.id },
    { ...materialReportSchema.team_name },
    {
      ...materialReportSchema.report_date,
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("DD/MM/YYYY");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    { ...materialReportSchema.shift },
    {
      ...materialReportSchema.start_time,
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    {
      ...materialReportSchema.end_time,
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    { id: "actions", label: "Actions" },
  ] as FieldConfig<MaterialReportDisplay>[];

  const handleOpenDetail = (row: MaterialReportDisplay) => {
    setSelectedMaterial(row);
    setEditGeneral(row);
    setOpenDetail(true);
    // fetchIngredient(row.id);
    setRowId(row.id);
    console.log(row.extral_materials);
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

  const fetchMaterialReport = async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      setMaterialReports(await fetchMaterialReportData(date));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialReport(selectedDate);
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
      <Box sx={{}}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={materialReports}
            actions={actions}
            getRowKey={(row) => row.id}
          />
        )}
        <DynamicPopup
          open={openDetail}
          onClose={handleCloseDetail}
          title={`Details: #${selectedMaterial?.id}`}
          enableSend={true}
        >
          <MaterialReportGeneralSection
            selectedMaterial={selectedMaterial}
            onSaveSuccess={() => fetchMaterialReport(selectedDate)}
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
          <OtherIngredient material_id={rowId} />
        </DynamicPopup>
      </Box>
    </Box>
  );
};

export default MaterialReportPage;
