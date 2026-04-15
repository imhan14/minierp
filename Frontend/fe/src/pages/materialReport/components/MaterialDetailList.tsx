import { useCallback, useEffect, useMemo } from "react";
import DataTable, { type ActionConfig } from "@components/DataTable";
import { materialDetailSchema } from "@/schema/materialDetail.schema";
import { Skeleton, TextField, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useMaterialReportDetailData from "../customHooks/useMaterialReportDetailData";
import useMaterialReportDetailForm from "../customHooks/useMaterialReportDetailForm";
import type { MaterialDetailDisplay } from "@/types/MaterialDetailType";

interface MaterialDetailListProps {
  material_id: number | null;
}

const MaterialDetailList = ({ material_id }: MaterialDetailListProps) => {
  const {
    detailLoading,
    error,
    editIngredients,
    fetchMaterialReportDetail,
    setEditIngredients,
  } = useMaterialReportDetailData();
  const { editingId, saveEditing, startEditing, cancelEditing } =
    useMaterialReportDetailForm(setEditIngredients);

  const handleIngredientChange = useCallback(
    (id: number, field: keyof MaterialDetailDisplay, value: string) => {
      setEditIngredients((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      );
    },
    [setEditIngredients],
  );

  const materialDetailColumns = useMemo(
    () => [
      { ...materialDetailSchema.ingredient_name },
      {
        ...materialDetailSchema.weight,
        render: (_: unknown, row: MaterialDetailDisplay) => (
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
        render: (_: unknown, row: MaterialDetailDisplay) => (
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
        render: (_: unknown, row: MaterialDetailDisplay) => (
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
    [editingId, handleIngredientChange],
  );

  const getDetailActions = useCallback(
    (row: MaterialDetailDisplay): ActionConfig<MaterialDetailDisplay>[] => {
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
    },
    [saveEditing, startEditing, cancelEditing, editingId],
  );

  useEffect(() => {
    fetchMaterialReportDetail(material_id);
  }, [material_id, fetchMaterialReportDetail]);
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
    </>
  );
};

export default MaterialDetailList;
