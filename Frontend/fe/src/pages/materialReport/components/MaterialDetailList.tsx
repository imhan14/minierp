import { useEffect, useMemo, useState } from "react";
import DataTable, { type ActionConfig } from "../../../components/DataTable";
import {
  materialDetailSchema,
  type MaterialDetailDisplay,
} from "../../../schema/materialDetail.schema";
import {
  Alert,
  Skeleton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { fetchIngredientData } from "../dataMaterialReport";
import api from "../../../apis/axios";

interface MaterialDetailListProps {
  material_id: number | null;
}

const MaterialDetailList = ({ material_id }: MaterialDetailListProps) => {
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalData, setOriginalData] =
    useState<MaterialDetailDisplay | null>(null);
  const [editIngredients, setEditIngredients] = useState<
    MaterialDetailDisplay[]
  >([]);
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
      { ...materialDetailSchema.ingredient_name },
      {
        ...materialDetailSchema.weight,
        render: (_, row) => (
          <TextField
            size="small"
            type="number"
            disabled={editingId !== row.id}
            value={row.weight || ""}
            onChange={(e) =>
              handleIngredientChange(row.id, "weight", e.target.value)
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
        ...materialDetailSchema.real_percent,
        render: (_, row) => (
          <TextField
            size="small"
            disabled={editingId !== row.id}
            value={row.real_percent || ""}
            onChange={(e) =>
              handleIngredientChange(row.id, "real_percent", e.target.value)
            }
          />
        ),
      },
      {
        ...materialDetailSchema.note,
        render: (_, row) => (
          <TextField
            size="small"
            fullWidth
            disabled={editingId !== row.id}
            value={row.note || ""}
            onChange={(e) =>
              handleIngredientChange(row.id, "note", e.target.value)
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
    row: MaterialDetailDisplay,
  ): ActionConfig<MaterialDetailDisplay>[] => {
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
    ];
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

  const startEditing = (row: MaterialDetailDisplay) => {
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

  const saveEditing = async (row: MaterialDetailDisplay) => {
    try {
      const payload = {
        weight: row?.weight,
        real_percent: row?.real_percent,
        note: row?.note,
      };
      await api.patch(`/material-detail/${row?.id}`, payload);
      setEditingId(null);
      setOriginalData(null);
      setSnackbar({
        open: true,
        message: "Cập nhật dữ liệu thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi nhập dữ liệu!",
        severity: "error",
      });
      console.error("Update failed", error);
    }
  };
  const fetchIngredient = async (material_id: number | null) => {
    try {
      setDetailLoading(true);
      setEditIngredients(await fetchIngredientData(material_id));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };
  useEffect(() => {
    fetchIngredient(material_id);
  }, [material_id]);
  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }
  return detailLoading ? (
    <Skeleton variant="rounded" height={300} />
  ) : (
    <>
      <DataTable
        columns={materialDetailColumns}
        data={editIngredients}
        actions={getDetailActions}
        getRowKey={(row) => row.id}
      />
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

export default MaterialDetailList;
