import {
  Box,
  CircularProgress,
  Divider,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
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
import {
  fetchIngredientData,
  fetchMaterialReportData,
} from "./dataMaterialReport";
import type { MaterialReportDisplay } from "../../schema/materialReport.schema";
import {
  materialDetailSchema,
  type MaterialDetailDisplay,
} from "../../schema/materialDetail.schema";
import MaterialReportGeneralSection from "./components/MaterialReportGeneralSection";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const MaterialReportPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [materialReports, setMaterialReports] = useState<
    MaterialReportDisplay[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  // const [materialDetail, setMaterialDetail] = useState<MaterialDetailDisplay[]>(
  //   [],
  // );
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialReportDisplay | null>(null);
  const [editGeneral, setEditGeneral] = useState<MaterialReportDisplay | null>(
    null,
  );
  const [editIngredients, setEditIngredients] = useState<
    MaterialDetailDisplay[]
  >([]);
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
    { id: "actions", label: "Details" },
  ] as FieldConfig<MaterialReportDisplay>[];

  const materialDetailColumns = [
    { ...materialDetailSchema.ingredient_name },
    {
      ...materialDetailSchema.weight,
      render: (value, row) => (
        <TextField
          size="small"
          disabled
          type="number"
          value={editIngredients.find((i) => i.id === row.id)?.weight || ""}
          onChange={(e) =>
            handleIngredientChange(row.id, "weight", e.target.value)
          }
        />
      ),
    },
    {
      ...materialDetailSchema.real_percent,
      render: (value, row) => (
        <TextField
          size="small"
          value={
            editIngredients.find((i) => i.id === row.id)?.real_percent || ""
          }
          onChange={(e) =>
            handleIngredientChange(row.id, "real_percent", e.target.value)
          }
        />
      ),
    },
    {
      ...materialDetailSchema.note,
      render: (value, row) => (
        <TextField
          size="small"
          fullWidth
          value={editIngredients.find((i) => i.id === row.id)?.note || ""}
          onChange={(e) =>
            handleIngredientChange(row.id, "note", e.target.value)
          }
        />
      ),
    },
    { id: "actions", label: "Actions" },
  ] as FieldConfig<MaterialDetailDisplay>[];

  const handleOpenDetail = (row: MaterialReportDisplay) => {
    setSelectedMaterial(row);
    setEditGeneral(row);
    setOpenDetail(true);
    fetchIngredient(row.id);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setTimeout(() => {
      setSelectedMaterial(null);
    }, 300);
  };

  const actions: ActionConfig<MaterialReportDisplay>[] = [
    {
      label: "Details",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: (row) => handleOpenDetail(row),
    },
  ];
  const detailActions: ActionConfig<MaterialDetailDisplay>[] = [
    {
      label: "Details",
      color: "primary",

      icon: <EditOutlinedIcon />,
      onClick: () => console.log(),
    },
  ];

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

  const fetchIngredient = async (material_id: number) => {
    try {
      setDetailLoading(true);
      // setMaterialDetail(await fetchIngredientData(material_id));
      setEditIngredients(await fetchIngredientData(material_id));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleIngredientChange = (
    id: number,
    field: keyof MaterialDetailDisplay,
    value: string,
  ) => {
    setEditIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
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
          <Box>
            {detailLoading ? (
              <Skeleton variant="rounded" height={300} />
            ) : (
              <DataTable
                columns={materialDetailColumns}
                data={editIngredients}
                actions={detailActions}
                getRowKey={(row) => row.id}
              />
            )}
          </Box>
        </DynamicPopup>
      </Box>
    </Box>
  );
};

export default MaterialReportPage;
