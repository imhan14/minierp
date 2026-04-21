import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { type ActionConfig } from "@components/DataTable";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFormulaDetailData } from "@/hooks/useFormulaDetailData";
import { useFormulaDetailForm } from "@/hooks/useFormulaDetailForm";
import type { FormulaDetailDisplay } from "@/types/FormulaDetailType";
import { formulaDetailSchema } from "@/schema/formulaDetail.schema";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import type { IngredientType } from "@/types/IngredientType";
import ingredientApi from "@/apis/ingredientApi";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface FormulaDetailListProps {
  formula_id: number | null;
  onSaveSuccess: () => void;
}

const FormulaDetailList = ({
  formula_id,
  onSaveSuccess,
}: FormulaDetailListProps) => {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const { formulaDetail, setFormulaDetail, fetchFormulaDetail } =
    useFormulaDetailData(formula_id);
  const {
    editingId,
    saveEditing,
    startEditing,
    cancelEditing,
    handleAddNewRow,
    showConfirmDialog,
    handleDetailChange,
    setShowConfirmDialog,
    handleDiscardChanges,
    handleSaveAndContinue,
    deleteRowWithGuard,
    logDetail,
    setLogDetail,
  } = useFormulaDetailForm(
    formula_id,
    () => fetchFormulaDetail(formula_id),
    formulaDetail,
    setFormulaDetail,
  );

  const handleIngredientChange = useCallback(
    (id: number | string, field: keyof FormulaDetailDisplay, value: string) => {
      setFormulaDetail((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      );
    },
    [setFormulaDetail],
  );

  const formulaDetailColumns = useMemo(
    () => [
      {
        ...formulaDetailSchema.ingredient_name,
        render: (_: unknown, row: FormulaDetailDisplay) => {
          const isEditing = editingId === row.id;
          return isEditing ? (
            <Autocomplete
              size="small"
              sx={{ width: 300 }}
              options={ingredients}
              renderInput={(params) => (
                <TextField {...params} label="Ingredient" />
              )}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.ingredient_name
              }
              isOptionEqualToValue={(option, value) => {
                if (!value) return false;
                return (
                  option.id === (typeof value === "string" ? value : value.id)
                );
              }}
              onChange={(_, newValue) => {
                if (newValue && typeof newValue !== "string") {
                  handleDetailChange(
                    row.id,
                    "ingredient_id",
                    String(newValue.id),
                  );
                  handleDetailChange(
                    row.id,
                    "ingredient_name",
                    newValue.ingredient_name,
                  );
                  handleDetailChange(row.id, "unit", newValue.unit);
                } else {
                  handleDetailChange(row.id, "ingredient_id", null);
                  handleDetailChange(row.id, "ingredient_name", newValue || "");
                  handleDetailChange(row.id, "unit", "");
                }
              }}
              value={
                (ingredients.find(
                  (p) => p.id === row.ingredient_id,
                ) as IngredientType) || row.ingredient_name
              }
            />
          ) : (
            <span>{row.ingredient_name}</span>
          );
        },
      },
      { ...formulaDetailSchema.unit },
      {
        ...formulaDetailSchema.standard_quality,
        render: (_: unknown, row: FormulaDetailDisplay) => (
          <TextField
            size="small"
            disabled={editingId !== row.id}
            value={row.standard_quality || ""}
            onChange={(e) =>
              handleIngredientChange(row.id, "standard_quality", e.target.value)
            }
          />
        ),
      },
      {
        id: "actions",
        label: "Actions",
      },
    ],
    [editingId, handleIngredientChange, handleDetailChange, ingredients],
  );

  const getDetailActions = (
    row: FormulaDetailDisplay,
  ): ActionConfig<FormulaDetailDisplay>[] => {
    if (editingId === row.id) {
      console.log(row.id);
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
        onClick: (row) => deleteRowWithGuard(row),
      },
    ];
  };
  useEffect(() => {
    const fetchIngredient = async () => {
      const ingredientOptions = await ingredientApi.getAllIngredients();
      setIngredients(ingredientOptions.data);
    };
    fetchIngredient();
  }, []);

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlinedIcon />}
        onClick={handleAddNewRow}
      >
        Thêm
      </Button>
      <DataTable
        columns={formulaDetailColumns}
        data={formulaDetail}
        actions={getDetailActions}
        getRowKey={(row) => row.id}
        hideEmptyRows={true}
      />
    </Box>
  );
};

export default FormulaDetailList;
