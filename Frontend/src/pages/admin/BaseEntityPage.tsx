import { Box, Button } from "@mui/material";
import { useMemo } from "react";
import DataTable, { type ActionConfig } from "@/components/DataTable";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import DynamicPopup from "@/components/DynamicPopup";
import Filters from "@/components/Filters";
import { useEntity } from "@/hooks/useEntity";
import { usePageForm } from "@/hooks/usePageForm";
import { getFieldConfigs } from "@/utils/schema-parser";
import { DrawerHeader } from "@/utils/others";
import type { FieldConfig } from "@/types/FieldConfig";
import type { FilterOption } from "@/components/Filters";
import type { ZodObject, ZodRawShape, ZodSchema } from "zod";
import type { EntityService } from "@/hooks/useEntityForm";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface BaseEntityPageProps<
  T extends { id?: number | string },
  CreatePayload,
  UpdatePayload,
> {
  fetchAll: (filters?: Record<string, unknown>) => Promise<{ data: T[] }>;
  service: EntityService<T, CreatePayload, UpdatePayload>;
  zodSchema: ZodObject<ZodRawShape>;
  createSchema: ZodSchema<CreatePayload>;
  updateSchema: ZodSchema<UpdatePayload>;
  addButtonLabel: string;
  addPopupTitle: string;
  editPopupTitle: string;
  deleteConfirmMessage: (row: T) => string;
  fieldWidths?: Partial<Record<string, number>>;
  disabledOnEdit?: (keyof T)[];
  filterOptions?: FilterOption[];
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
  };
}

const BaseEntityPage = <
  T extends { id?: number | undefined },
  CreatePayload,
  UpdatePayload,
>({
  fetchAll,
  service,
  zodSchema,
  createSchema,
  updateSchema,
  addButtonLabel,
  addPopupTitle,
  editPopupTitle,
  deleteConfirmMessage,
  fieldWidths = {},
  disabledOnEdit = [],
  filterOptions = [],
  messages,
}: BaseEntityPageProps<T, CreatePayload, UpdatePayload>) => {
  const { data, reload } = useEntity<T, T>(fetchAll);

  // Bóc tách thêm các hàm điều khiển Popup thực tế từ hook usePageForm
  const {
    form,
    popupMode,
    confirmOpen,
    isSaving,
    guardAction,
    handleDiscard,
    handleContinueEditing,
    handleOpenAdd,
    handleOpenEdit,
    handleClosePopup,
    handleAddSubmit,
    handleEditSave,
    setConfirmOpen,
  } = usePageForm<T, CreatePayload, UpdatePayload>({
    service,
    createSchema,
    updateSchema,
    defaultValues: {},
    messages,
    onSuccess: reload,
  });

  const fieldConfigs = useMemo(() => getFieldConfigs(zodSchema), [zodSchema]);

  const dialogFields = useMemo((): FieldConfig<T>[] => {
    return fieldConfigs
      .filter((f) => f.formOrder !== false && f.name !== "id")
      .map((f) => ({
        id: f.name as keyof T,
        label: f.label,
        inputType: f.type ?? "text",
        options: f.options,
        gridSize: f.name === "description" ? { xs: 12 } : { xs: 12, sm: 6 },
        isReadOnly: false,
        required: f.isRequired,
      }));
  }, [fieldConfigs]);

  const columns = useMemo(() => {
    const dynamicColumns = fieldConfigs
      .filter((f) => f.tableVisible)
      .map((f) => ({
        id: f.name as keyof T | "actions",
        label: f.label,
        width: fieldWidths[f.name],
        align: (f.type === "number" ? "right" : "left") as "right" | "left",
        render: (value: unknown) => {
          if (f.type === "number") return value?.toLocaleString() || "0";
          return value !== null && value !== undefined ? String(value) : "-";
        },
      }));
    return [...dynamicColumns, { id: "actions" as const, label: "Thao tác" }];
  }, [fieldConfigs, fieldWidths]);

  const disabledFields = useMemo(
    () =>
      Object.fromEntries(
        disabledOnEdit.map((key) => [key, form.mode === "edit"]),
      ) as Partial<Record<keyof T, boolean>>,
    [disabledOnEdit, form.mode],
  );

  const actions = (): ActionConfig<T>[] => [
    {
      label: "Sửa",
      color: "primary",
      icon: <EditOutlinedIcon />,
      onClick: (row) => handleOpenEdit(row), // Sửa từ guardAction sang hàm chuẩn handleOpenEdit
    },
    {
      label: "Xóa",
      icon: <DeleteOutlineIcon fontSize="small" />,
      color: "error",
      onClick: (row) =>
        guardAction(() => form.deleteRecord(row, deleteConfirmMessage(row))),
    },
  ];

  // Quyết định hàm submit dựa theo trạng thái popup hiện tại
  const handleSubmitAction = () => {
    if (popupMode === "add") {
      handleAddSubmit();
    } else if (popupMode === "edit") {
      handleEditSave();
    }
  };

  return (
    <>
      <DrawerHeader />
      <Filters
        filterOptions={filterOptions}
        onFilterChange={(f) => reload(f)}
      />
      <Box>
        <Button
          variant="contained"
          sx={{ marginBottom: 1 }}
          onClick={() => handleOpenAdd()} // Sửa sang hàm chuẩn handleOpenAdd
        >
          {addButtonLabel}
        </Button>

        <DataTable
          columns={columns}
          data={data}
          actions={actions}
          getRowKey={(row) => row.id!}
        />

        <DynamicPopup
          open={popupMode !== "closed"} // Dựa theo trạng thái popupMode thực tế
          onClose={handleClosePopup} // Dựa theo hàm close popup thực tế
          title={popupMode === "add" ? addPopupTitle : editPopupTitle}
          mode={popupMode === "closed" ? undefined : popupMode}
          onSubmit={handleSubmitAction} // Trỏ chuẩn về hàm chạy Validate Zod
          isSubmitting={form.isSubmitting || isSaving}
          maxWidth="sm"
        >
          <GeneralInfoSection<T>
            mode="form"
            displayFields={dialogFields}
            data={form.formData as T}
            onGeneralChange={(id, value) => form.setField(id, value)}
            errors={form.fieldErrors as Partial<Record<keyof T, string>>}
            disabledFields={disabledFields}
          />
        </DynamicPopup>

        <ConfirmDiscardDialog
          open={confirmOpen}
          onDiscard={handleDiscard}
          onClose={handleContinueEditing}
          onSave={async () => {
            handleSubmitAction();
            setConfirmOpen(false);
          }}
        />
      </Box>
    </>
  );
};

export default BaseEntityPage;
