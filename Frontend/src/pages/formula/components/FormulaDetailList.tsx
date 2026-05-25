import { useMemo } from "react";
import DataTable, { type ActionConfig } from "@components/DataTable";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { type FormulaDetailType } from "@/schema/formulaDetail.schema";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNotify } from "@/hooks/useNotify";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFormulaDetail } from "../customHooks/useFormulaDetail";

interface FormulaDetailListProps {
  formula_id: number | null;
  onSaveSuccess: () => void;
}

const FormulaDetailList = ({
  formula_id,
  onSaveSuccess,
}: FormulaDetailListProps) => {
  const notify = useNotify();
  const {
    rows,
    loading,
    editingId,
    editingData,
    isSaving,
    ingredientOptions,
    setField,
    handleAddNewRow,
    cancelEditing,
    saveEditing,
    handleDelete,
    startEditing,
  } = useFormulaDetail(formula_id, onSaveSuccess);
  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      {
        id: "ingredient_name" as keyof FormulaDetailType,
        label: "Tên nguyên liệu",
        width: 250,
        render: (_: unknown, row: FormulaDetailType) => {
          if (editingId !== row.id)
            return <span>{row.ingredient_name || "-"}</span>;
          const filteredIngredientOptions = ingredientOptions.filter(
            (option) => {
              const isAlreadySelected = rows.some(
                (r) => r.ingredient_id === option.id && r.id !== editingId,
              );
              return !isAlreadySelected;
            },
          );
          return (
            <Autocomplete
              size="small"
              sx={{ minWidth: 220 }}
              options={filteredIngredientOptions}
              getOptionLabel={(opt) =>
                typeof opt === "string" ? opt : opt.ingredient_name
              }
              isOptionEqualToValue={(opt, val) =>
                opt.id === (typeof val === "object" ? val?.id : val)
              }
              value={
                ingredientOptions.find(
                  (o) => o.id === editingData?.ingredient_id,
                ) || null
              }
              onChange={(_, newValue) => {
                if (newValue && typeof newValue !== "string") {
                  setField("ingredient_id", newValue.id);
                  setField("ingredient_name", newValue.ingredient_name);
                  setField("unit", newValue.unit);
                } else {
                  setField("ingredient_id", undefined);
                  setField("ingredient_name", "");
                  setField("unit", undefined);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Nguyên liệu *" size="small" />
              )}
            />
          );
        },
      },
      {
        id: "unit" as keyof FormulaDetailType,
        label: "Đơn vị",
        width: 80,
        render: (_: unknown, row: FormulaDetailType) => {
          const unit = editingId === row.id ? editingData?.unit : row.unit;
          return <span>{unit ?? "-"}</span>;
        },
      },
      {
        id: "standard_quality" as keyof FormulaDetailType,
        label: "Số lượng",
        width: 120,
        render: (_: unknown, row: FormulaDetailType) => {
          if (editingId !== row.id)
            return <span>{row.standard_quality ?? "-"}</span>;
          return (
            <TextField
              size="small"
              type="number"
              sx={{ width: 100 }}
              value={editingData?.standard_quality ?? ""}
              onChange={(e) =>
                setField(
                  "standard_quality",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              inputProps={{ min: 0.0001, step: 0.001 }}
            />
          );
        },
      },
      { id: "actions" as const, label: "Thao tác" },
    ],
    [editingId, editingData, ingredientOptions, setField, rows],
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  const actions = (
    row: FormulaDetailType,
  ): ActionConfig<FormulaDetailType>[] => {
    if (editingId === row.id) {
      return [
        {
          label: "Lưu",
          icon: <DoneOutlinedIcon />,
          color: "success",
          disabled: isSaving,
          onClick: () => saveEditing(),
        },
        {
          label: "Hủy",
          icon: <CloseOutlinedIcon />,
          color: "error",
          disabled: isSaving,
          onClick: () => cancelEditing(),
        },
      ];
    }
    return [
      {
        label: "Sửa",
        icon: <EditOutlinedIcon />,
        color: "primary",
        onClick: (row) => {
          if (editingId !== undefined) {
            notify(
              "Vui lòng lưu hoặc hủy dòng đang chỉnh sửa trước",
              "warning",
            );
            return;
          }
          startEditing(row);
        },
      },
      {
        label: "Xóa",
        icon: <DeleteOutlineIcon />,
        color: "error",
        onClick: handleDelete,
      },
    ];
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlinedIcon />}
        onClick={handleAddNewRow}
        disabled={loading ? true : !formula_id || isSaving}
        sx={{ mb: 1 }}
      >
        Thêm
      </Button>

      <DataTable
        columns={columns}
        data={rows}
        actions={actions}
        getRowKey={(row) => row.id}
        hideEmptyRows={true}
      />
    </Box>
  );
};

export default FormulaDetailList;
