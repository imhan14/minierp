import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DataTable, { type ActionConfig } from "@components/DataTable";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import type {
  ExtraMaterialsJson,
  MaterialReportType,
} from "@/schema/materialReport.schema";
import useOtherIngredientForm from "../customHooks/useOtherIngredientForm";
import useOtherIngredientData from "../customHooks/useOtherIngredientData";
import { EXTRA_MATERIALS_FIELD_CONFIGS } from "../utils/materialReport.fieldconfigs";

interface OtherIngredientProps {
  material_id: number | undefined;
  extral_material: MaterialReportType;
  onSaveSuccess: () => void;
}

const OtherIngredient = ({
  material_id,
  extral_material,
  onSaveSuccess,
}: OtherIngredientProps) => {
  const {
    getOtherIngredients,
    error,
    detailLoading,
    editIngredients,
    setEditIngredients,
  } = useOtherIngredientData(extral_material);

  const {
    handleAddNewRow,
    startEditing,
    cancelEditing,
    saveEditing,
    editingId,
    handleDeleteRow,
  } = useOtherIngredientForm(
    material_id,
    onSaveSuccess,
    editIngredients,
    setEditIngredients,
  );

  const handleIngredientChange = (
    id: number,
    field: keyof ExtraMaterialsJson,
    value: string,
  ) => {
    setEditIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          [field]:
            field === "weight" || field === "real_percent"
              ? value === ""
                ? 0
                : Number(value)
              : value,
        };
      }),
    );
  };

  const materialDetailColumns = [
    {
      ...EXTRA_MATERIALS_FIELD_CONFIGS.id,
      id: "id",
      render: (_: unknown, row: ExtraMaterialsJson) => (
        <TextField
          size="small"
          fullWidth
          disabled={editingId !== row.id}
          value={row.id || ""}
          onChange={(e) =>
            handleIngredientChange(row.id!, "id", e.target.value)
          }
        />
      ),
    },
    {
      ...EXTRA_MATERIALS_FIELD_CONFIGS.ingredient_name,
      id: "ingredient_name",
      render: (_: unknown, row: ExtraMaterialsJson) => (
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
      ...EXTRA_MATERIALS_FIELD_CONFIGS.weight,
      id: "weight",
      render: (_: unknown, row: ExtraMaterialsJson) => (
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
      ...EXTRA_MATERIALS_FIELD_CONFIGS.real_percent,
      id: "real_percent",
      render: (_: unknown, row: ExtraMaterialsJson) => (
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
      ...EXTRA_MATERIALS_FIELD_CONFIGS.note,
      id: "note",
      render: (_: unknown, row: ExtraMaterialsJson) => (
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
    { id: "actions", label: "Thao tác" },
  ];

  const getDetailActions = (
    row: ExtraMaterialsJson,
  ): ActionConfig<ExtraMaterialsJson>[] => {
    if (editingId === row.id) {
      return [
        {
          label: "Lưu",
          icon: <DoneOutlinedIcon />,
          color: "success",
          onClick: (r) => saveEditing(r),
        },
        {
          label: "Huỷ",
          icon: <CloseOutlinedIcon />,
          color: "error",
          onClick: () => cancelEditing(),
        },
      ];
    }
    return [
      {
        label: "Sửa",
        icon: <EditOutlinedIcon />,
        color: "primary",
        onClick: (r) => startEditing(r),
      },
      {
        label: "Xoá",
        icon: <DeleteOutlineIcon />,
        color: "warning",
        onClick: (r) => handleDeleteRow(r),
      },
    ];
  };

  useEffect(() => {
    getOtherIngredients();
  }, [getOtherIngredients]);

  if (error)
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );

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
        <Typography variant="h6">Nguyên liệu ngoài danh mục</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          onClick={handleAddNewRow}
        >
          Thêm nguyên liệu
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
          hideEmptyRows={true}
        />
      )}
    </>
  );
};

export default OtherIngredient;
