import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import DataTable, { type ActionConfig } from "@/components/DataTable";
import DynamicPopup from "@/components/DynamicPopup";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FormulaFiltersUI from "./components/FormulaFiltersUI";
import FormulaDetailList from "./components/FormulaDetailList";
import { useEntity } from "@/hooks/useEntity";
import formulaApi, { type FormulaFilters } from "@/apis/formulaApi";
import {
  CreateFormulaSchema,
  UpdateFormulaSchema,
  type FormulaCreatePayload,
  type FormulaType,
  type FormulaUpdatePayload,
} from "@/schema/formula.schema";
import { useEntityForm } from "@/hooks/useEntityForm";
import {
  FORMULA_ADD_FIELDS,
  FORMULA_EDIT_FIELDS,
  FORMULA_FIELD_CONFIGS,
  FORMULA_TABLE_FIELDS,
} from "./utils/formula.FieldConfigs";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import productionApi from "@/apis/productionApi";
import type { ProductType } from "@/types/ProductType";
import { useNotify } from "@/hooks/useNotify";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const FIELD_WIDTHS: Partial<Record<string, number>> = {
  formula_code: 80,
  formula_name: 300,
  product_name: 300,
  is_active: 100,
};
export type PopupMode = "closed" | "edit" | "add";
const FormulaPage = () => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [popupMode, setPopupMode] = useState<PopupMode>("closed");
  const [selectedFormula, setSelectedFormula] = useState<FormulaType | null>(
    null,
  );
  const [addStep, setAddStep] = useState(0);
  const [newFormulaId, setNewFormulaId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // ── Fetch product options một lần khi mount ───────────────────────────────
  const [productOptions, setProductOptions] = useState<
    { label: string; value: string }[]
  >([]);
  useEffect(() => {
    let isMounted = true;
    const fetchFormulaList = async () => {
      try {
        const response = await productionApi.getAllProducts();
        if (isMounted) {
          const formattedData = response.data.map((item: ProductType) => ({
            label: item.product_name,
            value: String(item.id),
          }));
          setProductOptions(formattedData);
        }
      } catch (err) {
        // notify("Get Product List failded", "error");
        console.error("API Error:", err);
      }
    };
    fetchFormulaList();
    return () => {
      isMounted = false;
    };
  }, []);

  const { data: formulas, reload } = useEntity<
    FormulaType,
    FormulaType,
    FormulaFilters
  >(formulaApi.getAllFormula);
  // ── Guard dirty ───────────────────────────────────────────────────────────
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
  // ── Form hook ─────────────────────────────────────────────────────────────
  const form = useEntityForm<
    FormulaType,
    FormulaCreatePayload,
    FormulaUpdatePayload
  >({
    service: {
      create: (payload) => formulaApi.createFormula(payload),
      update: (id, payload) => formulaApi.updateFormula(id, payload),
      delete: (id) => formulaApi.deleteFormula(id),
    },
    createSchema: CreateFormulaSchema,
    updateSchema: UpdateFormulaSchema,
    toCreatePayload: (d) => {
      const payload = d as FormulaCreatePayload;
      console.log(payload);
      return payload;
    },
    toUpdatePayload: (d) => {
      const payload = d as FormulaUpdatePayload;
      console.log(payload);
      return payload;
    },
    defaultValues: {},
    messages: {
      createSuccess: "Tạo công thức thành công",
      createError: "Tạo công thức thât bại",
    },

    onSuccess: reload,
  });
  // ── Mở/đóng popup ────────────────────────────────────────────────────────
  const handleOpenEdit = (row: FormulaType) => {
    guardAction(() => {
      setSelectedFormula(row);
      form.openEdit(row);
      setPopupMode("edit");
    });
  };

  const handleOpenAdd = () => {
    guardAction(() => {
      setSelectedFormula(null);
      setNewFormulaId(null);
      setAddStep(0);
      form.openAdd();
      setPopupMode("add");
    });
  };

  const handleClosePopup = () => {
    if (popupMode === "edit") {
      guardAction(() => {
        form.close();
        setPopupMode("closed");
      });
    } else {
      form.close();
      setPopupMode("closed");
      setAddStep(0);
      setNewFormulaId(null);
    }
  };
  // ── Submit General khi Add New → lấy id → chuyển sang step 1 ─────────────
  const handleAddGeneralSubmit = async () => {
    const parsed = CreateFormulaSchema.safeParse(form.formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return;
    }
    try {
      const res = await formulaApi.createFormula(parsed.data);
      const createdId: number = res.data?.id ?? 0;
      setNewFormulaId(createdId);
      setAddStep(1);
      reload();
      notify("Thêm công thức thành công!", "success");
    } catch (err) {
      notify("Thêm công thức thất bại!", "error");
      console.error("Create formula error:", err);
    }
  };
  const handleEditSave = async () => {
    const parsed = UpdateFormulaSchema.safeParse(form.formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return false;
    }

    setIsSaving(true);
    try {
      const res = await formulaApi.updateFormula(
        selectedFormula!.id!,
        parsed.data as FormulaUpdatePayload,
      );
      const raw = res.data as FormulaType;
      const merged: FormulaType = {
        ...raw,
        product_id: raw.products?.id ?? raw.product_id,
        product_name: raw.products?.product_name ?? raw.product_name,
      };

      setSelectedFormula(merged);
      form.openEdit(merged);

      notify("Cập nhật thành công!", "success");
      reload();
      return true;
    } catch (err) {
      if (selectedFormula) form.openEdit(selectedFormula);
      notify("Lỗi khi cập nhật!", "error");
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  // ── Field configs ─────────────────────────────────────────────────────────
  const columns = useMemo(() => {
    const dynamicColumns = FORMULA_TABLE_FIELDS.map((key) => {
      const cfg = FORMULA_FIELD_CONFIGS[key]!;
      return {
        id: key as keyof FormulaType | "actions",
        label: cfg.label,
        width: FIELD_WIDTHS[key],
        render: cfg.render
          ? (value: unknown) => cfg.render!(value as never, {} as FormulaType)
          : (value: unknown) => (value != null ? String(value) : "-"),
      };
    });
    return [...dynamicColumns, { id: "actions" as const, label: "Thao tác" }];
  }, []);
  // ── Form fields ──────────────────────────────────────────────
  const formFields = useMemo(() => {
    const fields =
      popupMode === "add" ? FORMULA_ADD_FIELDS : FORMULA_EDIT_FIELDS;
    return fields.map((key) => {
      const f = FORMULA_FIELD_CONFIGS[key]!;
      if (f.id !== "product_id") return f;
      return {
        ...f,
        label: "Tên sản phẩm",
        inputType: "autocomplete" as const,
        optionsAutoComplete: productOptions,
        getOptionLabel: (opt: { label: string; value: string } | string) =>
          typeof opt === "string" ? opt : opt.label,
        isOptionEqualToValue: (
          opt: { label: string; value: string },
          val: { label: string; value: string } | string,
        ) => opt.value === (typeof val === "string" ? val : val?.value),
        render: (value: unknown) =>
          productOptions.find((o) => o.value === String(value))?.label ??
          String(value ?? "-"),
      };
    });
  }, [productOptions, popupMode]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const actions = (): ActionConfig<FormulaType>[] => [
    {
      label: "Chi tiết",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: handleOpenEdit,
    },
  ];
  const popupTitle =
    popupMode === "add"
      ? "Thêm công thức mới"
      : `Công thức: ${selectedFormula?.formula_code ?? ""}`;
  const activeFormulaId =
    popupMode === "edit" ? (selectedFormula?.id ?? null) : newFormulaId;
  return (
    <>
      <DrawerHeader />
      <FormulaFiltersUI onFilterChange={(newFilters) => reload(newFilters)} />
      <Box>
        <Button
          variant="contained"
          sx={{ marginBottom: 1 }}
          onClick={handleOpenAdd}
        >
          Add new Formula
        </Button>

        <DataTable
          columns={columns}
          data={formulas}
          actions={actions}
          getRowKey={(row) => row.id}
        />

        <DynamicPopup
          open={popupMode !== "closed"}
          onClose={handleClosePopup}
          title={popupTitle}
          mode={popupMode === "add" && addStep === 0 ? "add" : undefined}
          onSubmit={
            popupMode === "add" && addStep === 0
              ? handleAddGeneralSubmit
              : undefined
          }
          isSubmitting={isSaving}
          maxWidth="md"
        >
          {popupMode === "add" && (
            <Stepper activeStep={addStep} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Thông tin chung</StepLabel>
              </Step>
              <Step>
                <StepLabel>Danh sách nguyên liệu</StepLabel>
              </Step>
            </Stepper>
          )}
          {(popupMode === "edit" || (popupMode === "add" && addStep === 0)) && (
            <GeneralInfoSection<FormulaType>
              mode={popupMode === "add" ? "form" : "view-edit"}
              showEditButton={popupMode === "edit"}
              displayFields={formFields}
              data={form.formData as FormulaType}
              onGeneralChange={(id, value) => {
                if (id === "product_id") {
                  form.setField(
                    "product_id",
                    value ? Number(value) : undefined,
                  );
                  const label =
                    productOptions.find((o) => o.value === value)?.label ?? "";
                  form.setField("product_name", label);
                } else {
                  form.setField(id, value);
                }
              }}
              errors={
                form.fieldErrors as Partial<Record<keyof FormulaType, string>>
              }
              disabledFields={{ formula_code: popupMode === "edit" }}
              onSave={popupMode === "edit" ? handleEditSave : undefined}
              onCancel={() => {
                if (selectedFormula) form.openEdit(selectedFormula);
                else {
                  form.close();
                  setPopupMode("closed");
                }
              }}
            />
          )}

          {(popupMode === "edit" || (popupMode === "add" && addStep === 1)) && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                >
                  Formula List
                </Typography>
              </Divider>
              <FormulaDetailList
                formula_id={activeFormulaId}
                onSaveSuccess={reload}
              />
            </>
          )}
        </DynamicPopup>
        <ConfirmDiscardDialog
          open={confirmOpen}
          onDiscard={handleDiscard}
          onClose={handleContinueEditing}
          onSave={async () => {
            await handleEditSave();
            setConfirmOpen(false);
          }}
        />
      </Box>
    </>
  );
};

export default FormulaPage;
