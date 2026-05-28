import { Box, Button, styled } from "@mui/material";
import { useMemo } from "react";
import IngredientFilterUI from "./components/IngredientFilterUI";
import DataTable, { type ActionConfig } from "@/components/DataTable";
import {
  CreateIngredientSchema,
  IngredientSchema,
  UpdateIngredientSchema,
} from "@/schema/ingredient.schema";
import type {
  IngredientCreatePayload,
  IngredientType,
  IngredientUpdatePayload,
} from "@/schema/ingredient.schema";
import { getFieldConfigs } from "@/utils/schema-parser";
// import type { IngredientType } from "@/types/IngredientType";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ingredientApi, { type IngredientFilters } from "@/apis/ingredientApi";
import { useEntity } from "@/hooks/useEntity";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import type { FieldConfig } from "@/types/FieldConfig";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import DynamicPopup from "@/components/DynamicPopup";
import { usePageForm } from "@/hooks/usePageForm";

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

const IngredientPage = () => {
  const { data: ingredients, reload } = useEntity<
    IngredientType,
    IngredientType,
    IngredientFilters
  >(ingredientApi.getAllIngredients);

  const {
    form,
    confirmOpen,
    handleDiscard,
    handleContinueEditing,
    guardAction,
    setConfirmOpen,
  } = usePageForm<
    IngredientType,
    IngredientCreatePayload,
    IngredientUpdatePayload
  >({
    service: {
      create: ingredientApi.createIngredient,
      update: ingredientApi.update,
    },
    createSchema: CreateIngredientSchema,
    updateSchema: UpdateIngredientSchema,
    defaultValues: {},
    messages: {
      createSuccess: "Thêm nguyên liệu thành công!",
      updateSuccess: "Cập nhật thành công!",
    },

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

        <DynamicPopup
          open={form.isOpen}
          onClose={() => guardAction(form.close)}
          title={
            form.mode === "add"
              ? "Thêm nguyên liệu mới"
              : "Chỉnh sửa nguyên liệu"
          }
          mode={form.mode === "idle" ? undefined : form.mode}
          onSubmit={form.submit}
          isSubmitting={form.isSubmitting}
          maxWidth="sm"
        >
          <GeneralInfoSection<IngredientType>
            mode="form"
            displayFields={dialogFields}
            data={form.formData as IngredientType}
            onGeneralChange={(id, value) => form.setField(id, value)}
            errors={
              form.fieldErrors as Partial<Record<keyof IngredientType, string>>
            }
            disabledFields={{
              ingredient_code: form.mode === "edit",
            }}
          />
        </DynamicPopup>

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
