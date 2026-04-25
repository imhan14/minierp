import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  styled,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import IngredientFilterUI from "./components/IngredientFilterUI";
import DataTable, { type ActionConfig } from "@/components/DataTable";
import {
  CreateIngredientSchema,
  IngredientSchema,
  UpdateIngredientSchema,
} from "@/schema/ingredient.schema";
import type {
  IngredientCreatePayload,
  IngredientUpdatePayload,
} from "@/schema/ingredient.schema";
import { getFieldConfigs } from "@/utils/schema-parser";
import type { IngredientType } from "@/types/IngredientType";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ingredientApi, { type IngredientFilters } from "@/apis/ingredientApi";
import { useEntity } from "@/hooks/useEntity";
import { useEntityForm } from "@/hooks/useEntityForm";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
type UnitType = "Kg" | "Met" | "Cai" | "Lit";
const IngredientPage = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientType | null>(null);
  const [editGeneral, setEditGeneral] = useState<IngredientType | null>(null);
  const { data: ingredients, reload } = useEntity<
    IngredientType,
    IngredientType,
    IngredientFilters
  >(ingredientApi.getAllIngredients);

  // ── Dirty check guard ─────────────────────────────────────────────────────────
  const guardAction = (action: () => void) => {
    if (form.isDirty) {
      setPendingAction(() => action);
      setConfirmOpen(true);
    } else {
      action();
    }
  };

  const handleDiscard = () => {
    form.close();
    setConfirmOpen(false);
    pendingAction?.();
    setPendingAction(null);
  };

  const handleContinueEditing = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };
  const form = useEntityForm<
    IngredientType,
    IngredientCreatePayload,
    IngredientUpdatePayload
  >({
    service: {
      create: (payload) => ingredientApi.createIngredient(payload),
      update: (id, payload) => ingredientApi.update(id, payload),
      delete: (id) => ingredientApi.deleteIngredient(id),
    },
    createSchema: CreateIngredientSchema,
    updateSchema: UpdateIngredientSchema,
    toCreatePayload: (d) => ({
      ingredient_code: d.ingredient_code ?? "",
      ingredient_name: d.ingredient_name ?? "",
      unit: (d.unit ?? "Kg") as UnitType,
      description: d.description ?? "",
    }),
    toUpdatePayload: (d) => ({
      ingredient_code: d.ingredient_code || undefined,
      ingredient_name: d.ingredient_name || undefined,
      unit: d.unit as UnitType | undefined,
      description: d.description || undefined,
    }),
    defaultValues: { ingredient_code: "", ingredient_name: "", unit: "" },
    onSuccess: reload,
  });

  const ingredientConfigs = useMemo(
    () => getFieldConfigs(IngredientSchema),
    [],
  );
  const columns = useMemo(() => {
    const dynamicColumns = ingredientConfigs
      .filter((f) => f.tableVisible)
      .map((f) => ({
        id: f.name as keyof IngredientType | "actions",
        label: f.label,
        width: f.name === "ingredient_name" ? 250 : 150,
        align: (f.type === "number" ? "right" : "left") as "right" | "left",
        render: (value: unknown) => {
          if (f.type === "number") return value?.toLocaleString() || "0";
          return value !== null && value !== undefined ? String(value) : "-";
        },
      }));

    return [
      ...dynamicColumns,
      {
        id: "actions",
        label: "Thao tác",
        // width: 120,
        // align: "right" as const,
      },
    ];
  }, [ingredientConfigs]);

  //____actions_______________________________________________________
  const actions = (): ActionConfig<IngredientType>[] => {
    return [
      {
        label: "Details",
        color: "primary",
        icon: <RemoveRedEyeOutlinedIcon />,
        onClick: (row) => {
          setSelectedIngredient(row);
          setOpenDetail(true);
        },
      },
      {
        label: "Sửa",
        color: "primary",
        icon: <EditOutlinedIcon />,
        onClick: (row) => guardAction(() => form.openEdit(row)),
      },
      {
        label: "Xóa",
        icon: <DeleteOutlineIcon fontSize="small" />,
        color: "error",
        onClick: (row) =>
          guardAction(() =>
            form.deleteRecord(row, `Xóa nguyên liệu "${row.ingredient_name}"?`),
          ),
      },
    ];
  };
  const unitField = ingredientConfigs.find((f) => f.name === "unit");
  return (
    <>
      <DrawerHeader />
      <IngredientFilterUI onFilterChange={(newFilters) => reload(newFilters)} />
      <Box>
        {/* {!isSubmitting && ( */}
        <Button
          variant="contained"
          sx={{ marginBottom: 1 }}
          onClick={() => guardAction(form.openAdd)}
        >
          Add new Ingredient
        </Button>
        {/* )} */}
        <DataTable
          columns={columns}
          data={ingredients}
          actions={actions}
          getRowKey={(row) => row.id}
        />

        <Dialog
          open={form.isOpen}
          onClose={() => guardAction(form.close)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {form.mode === "add"
              ? "Thêm nguyên liệu mới"
              : "Chỉnh sửa nguyên liệu"}
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {/* Mã nguyên liệu */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mã nguyên liệu *"
                  value={form.formData.ingredient_code ?? ""}
                  onChange={(e) =>
                    form.setField("ingredient_code", e.target.value)
                  }
                  error={!!form.fieldErrors.ingredient_code}
                  helperText={form.fieldErrors.ingredient_code}
                  // Không cho sửa mã khi edit (business rule)
                  disabled={form.mode === "edit"}
                />
              </Grid>

              {/* Tên nguyên liệu */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên nguyên liệu *"
                  value={form.formData.ingredient_name ?? ""}
                  onChange={(e) =>
                    form.setField("ingredient_name", e.target.value)
                  }
                  error={!!form.fieldErrors.ingredient_name}
                  helperText={form.fieldErrors.ingredient_name}
                />
              </Grid>

              {/* Đơn vị */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Đơn vị *"
                  value={form.formData.unit ?? ""}
                  onChange={(e) => form.setField("unit", e.target.value)}
                  error={!!form.fieldErrors.unit}
                  helperText={form.fieldErrors.unit}
                >
                  {unitField?.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Mô tả */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mô tả"
                  multiline
                  rows={2}
                  value={form.formData.description ?? ""}
                  onChange={(e) => form.setField("description", e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => guardAction(form.close)}
              disabled={form.isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color={form.mode === "add" ? "primary" : "success"}
              onClick={form.submit}
              disabled={form.isSubmitting}
            >
              {form.isSubmitting
                ? "Đang lưu..."
                : form.mode === "add"
                  ? "Thêm mới"
                  : "Lưu thay đổi"}
            </Button>
          </DialogActions>
        </Dialog>
        <ConfirmDiscardDialog
          open={confirmOpen}
          onContinueEditing={handleContinueEditing}
          onDiscard={handleDiscard}
          onClose={handleContinueEditing}
        />
      </Box>
    </>
  );
};

export default IngredientPage;
