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
  MaterialReportDisplay,
} from "@/types/MaterialReportType";
import { ExtraMaterialsJsonSchema } from "@/schema/extralMaterial.schema";
import useOtherIngredientForm from "../customHooks/useOtherIngredientForm";
import useOtherIngredientData from "../customHooks/useOtherIngredientData";

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

  const materialDetailColumns = [
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
  ];

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

  useEffect(() => {
    getOtherIngredients();
  }, [getOtherIngredients]);

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
          hideEmptyRows={true}
        />
      )}
    </>
  );
};

export default OtherIngredient;
