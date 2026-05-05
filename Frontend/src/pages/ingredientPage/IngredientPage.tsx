import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
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
import ingredientApi, { type IngredientFilters } from "@/apis/ingredientApi";
import { useEntity } from "@/hooks/useEntity";
import { useEntityForm } from "@/hooks/useEntityForm";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import type { FieldConfig } from "@/types/FieldConfig";
import GeneralInfoSection from "@/components/GeneralInfoSection";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const FIELD_WIDTHS: Partial<Record<string, number>> = {
  ingredient_code: 130,
  ingredient_name: 200,
  unit: 100,
};

type UnitType = "Kg" | "Met" | "Cai" | "Lit";
const IngredientPage = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
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
  const dialogFields = useMemo((): FieldConfig<IngredientType>[] => {
    return ingredientConfigs
      .filter((f) => f.formOrder !== false && f.name !== "id")
      .map((f) => ({
        id: f.name as keyof IngredientType,
        label: f.label,
        inputType: f.type ?? "text",
        options: f.options,
        gridSize: f.name === "description" ? { xs: 12 } : { xs: 12, sm: 6 },
        isReadOnly: false,
        required: f.isRequired,
      }));
  }, [ingredientConfigs]);
  // ── Columns cho DataTable ──────────────────────────────────────────────────
  const columns = useMemo(() => {
    const dynamicColumns = ingredientConfigs
      .filter((f) => f.tableVisible)
      .map((f) => ({
        id: f.name as keyof IngredientType | "actions",
        label: f.label,
        width: FIELD_WIDTHS[f.name],
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
      },
    ];
  }, [ingredientConfigs]);

  //____actions_______________________________________________________
  const actions = (): ActionConfig<IngredientType>[] => {
    return [
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
  return (
    <>
      <DrawerHeader />
      <IngredientFilterUI onFilterChange={(newFilters) => reload(newFilters)} />
      <Box>
        <Button
          variant="contained"
          sx={{ marginBottom: 1 }}
          onClick={() => guardAction(form.openAdd)}
        >
          Add new Ingredient
        </Button>
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

          <DialogContent dividers sx={{ pt: 2 }}>
            <GeneralInfoSection<IngredientType>
              mode="form"
              displayFields={dialogFields}
              data={form.formData as IngredientType}
              onGeneralChange={(id, value) => form.setField(id, value)}
              errors={
                form.fieldErrors as Partial<
                  Record<keyof IngredientType, string>
                >
              }
              disabledFields={{
                ingredient_code: form.mode === "edit",
              }}
            />
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
          onDiscard={handleDiscard}
          onClose={handleContinueEditing}
          onSave={async () => {
            await form.submit();
            setConfirmOpen(false);
          }}
        />
      </Box>
    </>
  );
};

export default IngredientPage;
