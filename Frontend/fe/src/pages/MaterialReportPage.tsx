import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Filters from "../components/Filters";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DataTable, {
  type ActionConfig,
  type ColumnConfig,
} from "../components/DataTable";
import type { MaterialReportType } from "../types/MaterialReportType";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import api from "../apis/axios";
import DynamicPopup from "../components/DynamicPopup";
import type { MaterialDetailType } from "../types/MaterialDetailType";
import GeneralInfoSection from "../components/GeneralInfoSection";
// import type { FieldConfig } from "../components/GeneralInfoSection";
import type { FieldConfig } from "../types/FieldConfig";
import { materialReportSchema } from "../schema/materialReport.schema";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface MaterialReportDisplay extends Omit<MaterialReportType, "teams"> {
  team_name: string;
}
interface MaterialDetailDisplay extends Omit<
  MaterialDetailType,
  "ingredients"
> {
  ingredient_name: string;
}

const MaterialReportPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [materialReports, setMaterialReports] = useState<
    MaterialReportDisplay[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [materialDetail, setMaterialDetail] = useState<MaterialDetailDisplay[]>(
    [],
  );
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialReportDisplay | null>(null);
  const [editGeneral, setEditGeneral] = useState<MaterialReportDisplay | null>(
    null,
  );
  const [editIngredients, setEditIngredients] = useState<
    MaterialDetailDisplay[]
  >([]);

  const materialReportColumn: ColumnConfig<MaterialReportDisplay>[] = [
    { id: "id", label: "id" },
    { id: "team_name", label: "Team Name" },
    {
      id: "report_date",
      label: "Report Date",
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("DD/MM/YYYY");
      }) as ColumnConfig<MaterialReportDisplay>["render"],
    },
    { id: "shift", label: "Shift" },
    {
      id: "start_time",
      label: "Start Time",
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as ColumnConfig<MaterialReportDisplay>["render"],
    },
    {
      id: "end_time",
      label: "End Time",
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as ColumnConfig<MaterialReportDisplay>["render"],
    },
    { id: "actions", label: "Details", align: "left" },
    // { id: "foreman_check", label: "Foreman Check" },
  ];
  // const displayField: FieldConfig<MaterialReportDisplay>[] = [
  //   { id: "team_name", label: "Team Name" },
  //   { id: "report_date", label: "Report Date" },
  // ];
  const materialDetailColumns: ColumnConfig<MaterialDetailDisplay>[] = [
    { id: "ingredient_name", label: "Ingredient Name" },
    {
      id: "weight",
      label: "Weight",
      render: (value, row) => (
        <TextField
          size="small"
          type="number"
          value={editIngredients.find((i) => i.id === row.id)?.weight || ""}
          onChange={(e) =>
            handleIngredientChange(row.id, "weight", e.target.value)
          }
        />
      ),
    },
    {
      id: "real_percent",
      label: "Real Percent",
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
      id: "note",
      label: "Note",
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
  ];
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

  const displayFields = materialReportSchema.filter(
    (col) => col.id !== "id" && col.id !== "actions",
  );

  const actions: ActionConfig<MaterialReportDisplay>[] = [
    {
      label: "Details",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: (row) => handleOpenDetail(row),
    },
  ];
  const fetchMaterialReport = async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
      const response = await api.get<MaterialReportType[]>(`/material-report`, {
        params: { date: dateParam },
      });
      const formattedData: MaterialReportDisplay[] = response.data.map(
        (item) => {
          const { teams, ...rest } = item;
          return {
            ...rest,
            team_id: teams?.id,
            team_name: teams?.team_name || "N/A",
          };
        },
      );
      console.log(response.data);
      setMaterialReports(formattedData);
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
      // const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
      const response = await api.get<MaterialDetailType[]>(`/material-detail`, {
        params: { material_id: material_id },
      });
      const formattedData: MaterialDetailDisplay[] = response.data.map(
        (item) => {
          const { ingredients, ...rest } = item;
          return {
            ...rest,
            ingredient_name: ingredients?.ingredient_name,
          };
        },
      );
      // console.log(response.data);
      setMaterialDetail(formattedData);
      setEditIngredients(formattedData);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };
  const handleGeneralChange = (
    field: keyof MaterialReportDisplay,
    value: string,
  ) => {
    if (editGeneral) {
      setEditGeneral({ ...editGeneral, [field]: value });
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
  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        general: editGeneral,
        ingredients: editIngredients,
      };

      await api.patch(`/material-report/${editGeneral?.id}`, payload);

      alert("Cập nhật thành công!");
      setOpenDetail(false);
      fetchMaterialReport(selectedDate);
    } catch (err) {
      console.error("Save error:", err);
      alert("Lỗi khi lưu dữ liệu");
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={materialReportSchema}
          data={materialReports}
          actions={actions}
          getRowKey={(row) => row.id}
        />
      )}

      <DynamicPopup
        open={openDetail}
        onClose={handleCloseDetail}
        onSubmit={handleSave}
        title={`Details: #${selectedMaterial?.id}`}
        enableSend={true}
      >
        <GeneralInfoSection
          title="General"
          displayFields={displayField}
          data={editGeneral}
          onGeneralChange={() => console.log("ok")}
          onSave={() => console.log("ok")}
        />
        {editGeneral && (
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              General Information
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {displayFields.map((col) => (
                <Grid size={2} key={col.id}>
                  <TextField
                    fullWidth
                    label={col.label}
                    size="small"
                    // Chỉ cho phép sửa một số trường nhất định, ví dụ shift
                    disabled={
                      col.id === "team_name" || col.id === "report_date"
                    }
                    value={
                      editGeneral[col.id as keyof MaterialReportDisplay] || ""
                    }
                    onChange={(e) =>
                      handleGeneralChange(
                        col.id as keyof MaterialReportDisplay,
                        e.target.value,
                      )
                    }
                  />
                </Grid>
              ))}
            </Grid>
            <Button variant="contained">sdfd</Button>
            <Divider sx={{ my: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Ingredient List (Editable)
              </Typography>
            </Divider>

            {detailLoading ? (
              <Skeleton variant="rounded" height={300} />
            ) : (
              <DataTable
                columns={materialDetailColumns}
                data={editIngredients} // Sử dụng dữ liệu từ state edit
                getRowKey={(row) => row.id}
              />
            )}
          </Box>
        )}
      </DynamicPopup>
    </Box>
  );
};

export default MaterialReportPage;
