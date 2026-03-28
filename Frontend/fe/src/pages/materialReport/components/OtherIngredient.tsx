import {
  Alert,
  Box,
  Button,
  Skeleton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DataTable, { type ActionConfig } from "../../../components/DataTable";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import api from "../../../apis/axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { MaterialReportDisplay } from "../../../schema/materialReport.schema";
import type { ExtraMaterialsJson } from "../../../types/MaterialReportType";
import { ExtraMaterialsJsonSchema } from "../../../schema/extralMaterial.schema";

interface MaterialDetailListProps {
  material_id: number | undefined;
  extral_material: MaterialReportDisplay | null;
  onSaveSuccess: () => void;
}

const OtherIngredient = ({
  material_id,
  extral_material,
  onSaveSuccess,
}: MaterialDetailListProps) => {
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingId, setEditingId] = useState<
    number | null | string | undefined
  >(null);
  const [originalData, setOriginalData] = useState<ExtraMaterialsJson | null>(
    null,
  );
  const [editIngredients, setEditIngredients] = useState<ExtraMaterialsJson[]>(
    [],
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const materialDetailColumns = useMemo(
    () => [
      {
        ...ExtraMaterialsJsonSchema.ingredient_name,
        render: (_: string | number | undefined, row: ExtraMaterialsJson) => (
          <TextField
            size="small"
            fullWidth
            disabled={editingId !== row.id}
            value={row.ingredient_name || ""}
            onChange={(e) =>
              handleIngredientChange(row.id!, "ingredient_name", e.target.value)
            }
          />
        ),
      },
      {
        ...ExtraMaterialsJsonSchema.weight,
        render: (_: string | number | undefined, row: ExtraMaterialsJson) => (
          <TextField
            size="small"
            type="number"
            disabled={editingId !== row.id}
            value={row.weight ?? ""}
            onChange={(e) =>
              handleIngredientChange(row.id!, "weight", e.target.value)
            }
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000",
              },
            }}
          />
        ),
      },
      {
        ...ExtraMaterialsJsonSchema.real_percent,
        render: (_: string | number | undefined, row: ExtraMaterialsJson) => (
          <TextField
            size="small"
            disabled={editingId !== row.id}
            value={row.real_percent ?? ""}
            onChange={(e) =>
              handleIngredientChange(row.id!, "real_percent", e.target.value)
            }
          />
        ),
      },
      {
        ...ExtraMaterialsJsonSchema.note,
        render: (_: string | number | undefined, row: ExtraMaterialsJson) => (
          <TextField
            size="small"
            fullWidth
            disabled={editingId !== row.id}
            value={row.note || ""}
            onChange={(e) =>
              handleIngredientChange(row.id!, "note", e.target.value)
            }
          />
        ),
      },
      {
        id: "actions",
        label: "Actions",
      },
    ],
    [editingId],
  );

  const getDetailActions = (
    row: ExtraMaterialsJson,
  ): ActionConfig<ExtraMaterialsJson>[] => {
    if (editingId === row.id) {
      return [
        {
          label: "Save",
          icon: <DoneOutlinedIcon />,
          color: "success",
          onClick: (row) => saveEditing(row),
        },
        {
          label: "Cancel",
          icon: <CloseOutlinedIcon />,
          color: "error",
          onClick: () => cancelEditing(),
        },
      ];
    }
    return [
      {
        label: "Edit",
        icon: <EditOutlinedIcon />,
        color: "primary",
        onClick: (row) => startEditing(row),
      },
      {
        label: "Delete",
        icon: <DeleteOutlineIcon />,
        color: "warning",
        onClick: (row) => handleDeleteRow(row),
      },
    ];
  };

  const handleIngredientChange = (
    id: number | string,
    field: keyof ExtraMaterialsJson,
    value: string,
  ) => {
    setEditIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]:
              field === "weight" || field === "real_percent"
                ? value === ""
                  ? 0
                  : Number(value)
                : value,
          };
        }
        return item;
      }),
    );
  };

  const startEditing = (row: ExtraMaterialsJson) => {
    if (editingId !== null && editingId !== row.id && originalData) {
      setEditIngredients((prev) =>
        prev.map((item) => (item.id === originalData.id ? originalData : item)),
      );
    }
    setEditingId(row.id);
    setOriginalData({ ...row });
  };

  const cancelEditing = () => {
    if (originalData) {
      setEditIngredients((prev) =>
        prev.map((item) => (item.id === originalData.id ? originalData : item)),
      );
    }
    setEditingId(null);
    setOriginalData(null);
  };

  const saveEditing = async (row: ExtraMaterialsJson) => {
    try {
      const updatedList = editIngredients.map((item) =>
        item.id === row.id ? row : item,
      );
      await api.patch(`/material-report/${material_id}`, {
        extral_materials: updatedList,
      });
      setEditingId(null);
      setOriginalData(null);
      setSnackbar({
        open: true,
        message: "Cập nhật dữ liệu thành công!",
        severity: "success",
      });
      onSaveSuccess();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi nhập dữ liệu!",
        severity: "error",
      });
      console.error("Update failed", error);
    }
  };

  const handleDeleteRow = async (row: ExtraMaterialsJson) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) return;
    try {
      const updatedList = editIngredients.filter((item) => item.id !== row.id);
      await api.patch(`/material-report/${material_id}`, {
        extral_materials: updatedList,
      });
      setEditIngredients(updatedList);
      setSnackbar({
        open: true,
        message: "Xóa thành công!",
        severity: "success",
      });
      onSaveSuccess();
    } catch (error) {
      setSnackbar({ open: true, message: "Lỗi khi xóa!", severity: "error" });
      console.error(error);
    }
  };

  const getIngredient = async () => {
    try {
      setDetailLoading(true);
      const materialsWithIds = (extral_material?.extral_materials || []).map(
        (item, index) => ({
          ...item,
          id: item.id || `${extral_material?.id}-${index}`,
        }),
      );
      setEditIngredients(materialsWithIds);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    getIngredient();
  }, [material_id, extral_material]);

  const handleAddNewRow = () => {
    const newRow: ExtraMaterialsJson = {
      id: Date.now(),
      ingredient_name: "",
      weight: 0,
      real_percent: 0,
      note: "",
    };
    setEditIngredients((prev) => [newRow, ...prev]);
    setEditingId(newRow.id);
  };
  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Danh sách nguyên liệu</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          onClick={handleAddNewRow}
        >
          Thêm nguyên liệu ngoài danh mục
        </Button>
      </Box>
      {detailLoading ? (
        <Skeleton variant="rounded" height={300} />
      ) : (
        <DataTable
          columns={materialDetailColumns}
          data={editIngredients}
          actions={getDetailActions}
          getRowKey={(row) => row.id!}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OtherIngredient;
