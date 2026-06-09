import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Filters from "@/components/Filters";
import DataTable, { type ActionConfig } from "@components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DynamicPopup from "../../components/DynamicPopup";
import {
  CreateProductionLogSchema,
  UpdateProductionLogSchema,
  type ProductionLogCreatePayload,
  type ProductionLogType,
  type ProductionLogUpdatePayload,
} from "@/schema/productionLog.schema";
import ProductionLogDetail from "./components/ProductionLogDetail";
import { useNotify } from "@/hooks/useNotify";
import { useEntity } from "@/hooks/useEntity";
import type { ProductionLogFilters } from "@/apis/productionLogApi";
import productionLogApi from "@/apis/productionLogApi";
import { useEntityForm } from "@/hooks/useEntityForm";
import {
  PRODUCTION_LOG_ADD_FIELDS,
  PRODUCTION_LOG_EDIT_FIELDS,
  PRODUCTION_LOG_FIELD_CONFIGS,
  PRODUCTION_LOG_TABLE_FIELDS,
} from "./utils/productionLog.fieldConfigs";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import teamApi from "@/apis/teamApi";
import type { TeamType } from "@/schema/team.schema";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
export type PopupMode = "closed" | "edit" | "add";

const ProductionLogPage = () => {
  const notify = useNotify();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isProductTeam =
    currentUser.team_id === 1 ||
    currentUser.team_id === 2 ||
    currentUser.team_id === 3;

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [popupMode, setPopupMode] = useState<PopupMode>("closed");
  const [selectedLog, setSelectedLog] = useState<ProductionLogType | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  // ── Fetch options ───────────────────────────────
  const [teamOptions, setTeamOptions] = useState<
    { label: string; value: string }[]
  >([]);
  useEffect(() => {
    let isMounted = true;
    const fetchTeamList = async () => {
      try {
        const response = await teamApi.getAllTeams();
        if (isMounted) {
          const formattedData = response.data.map((item: TeamType) => ({
            label: item.team_name,
            value: String(item.id),
          }));
          setTeamOptions(formattedData);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchTeamList();
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (filterMode === "single" && selectedDate) {
      reload({ date: selectedDate.format("YYYY-MM-DD") });
    } else if (filterMode === "range" && selectedDate && endDate) {
      reload({
        startDate: selectedDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      });
    }
  }, [selectedDate, endDate, filterMode]);
  // ── Guard dirty ───────────────────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const guardAction = (action: () => void) => {
    if (form.isDirty) {
      setPendingAction(() => action);
      setConfirmOpen(true);
    } else action();
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
  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: productionLogs, reload } = useEntity<
    ProductionLogType,
    ProductionLogType,
    ProductionLogFilters
  >(productionLogApi.getAllProductionLog);
  // ── Form hook ─────────────────────────────────────────────────────────────
  const form = useEntityForm<
    ProductionLogType,
    ProductionLogCreatePayload,
    ProductionLogUpdatePayload
  >({
    service: {
      create: (payload) => productionLogApi.createProductionLog(payload),
      update: (id, payload) =>
        productionLogApi.updateProductionLog(id, payload),
      // delete: (id) => productionLogApi.deleteFormula(id),
    },
    createSchema: CreateProductionLogSchema,
    updateSchema: UpdateProductionLogSchema,
    toCreatePayload: (d) => {
      return d as ProductionLogCreatePayload;
    },
    toUpdatePayload: (d) => {
      const payload = d as ProductionLogUpdatePayload;
      console.log(payload);
      return payload;
    },
    defaultValues: {
      log_date: dayjs().format("YYYY-MM-DD"),
      // log_start: dayjs().toISOString(),
      team_id: currentUser.team_id ? (currentUser.team_id ?? 0) : "",
      team_name: currentUser.team_name > 0 ? currentUser.team_name : "",
    },
    messages: {
      createSuccess: "Tạo báo cáo thành công",
      createError: "Tạo báo cáo thât bại",
    },
    onSuccess: reload,
  });
  // ── Mở/đóng popup ────────────────────────────────────────────────────────
  const handleOpenEdit = (row: ProductionLogType) => {
    console.log(currentUser);
    guardAction(() => {
      setSelectedLog(row);
      form.openEdit(row);
      setPopupMode("edit");
    });
  };
  const handleOpenAdd = () => {
    guardAction(() => {
      setSelectedLog(null);
      form.openAdd();
      if (isProductTeam) {
        form.setField("team_id", Number(currentUser.team_id));
      }
      setPopupMode("add");
    });
  };
  const handleClosePopup = () => {
    if (popupMode === "edit")
      guardAction(() => {
        form.close();
        setPopupMode("closed");
      });
    else {
      form.close();
      setPopupMode("closed");
    }
  };
  // ── Add submit ────────────────────────────────────────────────────────────
  const handleAddSubmit = async () => {
    const parsed = CreateProductionLogSchema.safeParse(form.formData);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return;
    }
    try {
      await productionLogApi.createProductionLog(parsed.data);
      notify("Thêm báo cáo thành công!", "success");
      form.close();
      setPopupMode("closed");
      reload();
    } catch (err) {
      notify("Lỗi khi thêm báo cáo!", "error");
      console.error(err);
    }
  };
  // ── Edit save ─────────────────────────────────────────────────────────────
  const handleEditSave = async (): Promise<boolean> => {
    const parsed = UpdateProductionLogSchema.safeParse(form.formData);

    if (!parsed.success) {
      console.error("Zod Validation Errors:", parsed.error.format());
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return false;
    }
    setIsSaving(true);
    try {
      const res = await productionLogApi.updateProductionLog(
        selectedLog!.id!,
        parsed.data as ProductionLogUpdatePayload,
      );
      const updated = res.data as ProductionLogType;
      setSelectedLog(updated);
      form.openEdit(updated);
      notify("Cập nhật thành công!", "success");
      reload();
      return true;
    } catch (err) {
      if (selectedLog) form.openEdit(selectedLog);
      notify("Lỗi khi cập nhật!", "error");
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(() => {
    const dynamicColumns = PRODUCTION_LOG_TABLE_FIELDS.map((key) => {
      const cfg = PRODUCTION_LOG_FIELD_CONFIGS[key]!;
      return {
        id: key as keyof ProductionLogType | "actions",
        label: cfg.label,
        // width: FIELD_WIDTHS[key],
        render: cfg.render
          ? (value: unknown) =>
              cfg.render!(value as never, {} as ProductionLogType)
          : (value: unknown) => (value != null ? String(value) : "-"),
      };
    });
    return [...dynamicColumns, { id: "actions" as const, label: "Thao tác" }];
  }, []);
  // ── Form fields ───────────────────────────────────────────────────────────
  const formFields = useMemo(() => {
    const fields =
      popupMode === "add"
        ? PRODUCTION_LOG_ADD_FIELDS
        : PRODUCTION_LOG_EDIT_FIELDS;
    return fields.map((key) => {
      const f = PRODUCTION_LOG_FIELD_CONFIGS[key]!;
      if (f.id !== "team_id") return f;
      return {
        ...f,
        label: "Tổ",
        inputType: "autocomplete" as const,
        optionsAutoComplete: teamOptions,
        getOptionLabel: (opt: { label: string; value: string } | string) =>
          typeof opt === "string" ? opt : opt.label,
        isOptionEqualToValue: (
          opt: { label: string; value: string },
          val: { label: string; value: string } | string,
        ) => opt.value === (typeof val === "string" ? val : val?.value),
        render: (value: unknown) =>
          teamOptions.find((o) => o.value === String(value))?.label ??
          String(value ?? "-"),
      };
    });
  }, [popupMode, teamOptions]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const actions = (): ActionConfig<ProductionLogType>[] => [
    {
      label: "Chi tiết",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: handleOpenEdit,
    },
  ];

  const popupTitle =
    popupMode === "add"
      ? "Thêm báo cáo mới"
      : `Báo cáo: ${selectedLog?.team_name ?? ""} - ${selectedLog?.log_date ? dayjs(selectedLog.log_date).format("DD/MM/YYYY") : ""}`;
  return (
    <Box>
      <DrawerHeader />
      <Filters
        showDateFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        mode={filterMode}
        setMode={setFilterMode}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <Box sx={{}}>
        {currentUser.role < 8 && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              disabled={filterMode === "range"}
              sx={{ marginBottom: 1 }}
              onClick={handleOpenAdd}
            >
              Add new Report
            </Button>
            {filterMode === "range" && (
              <Typography sx={{ color: "red" }} variant="subtitle2">
                *Add button only available on Single Mode
              </Typography>
            )}
          </Box>
        )}

        <DataTable
          columns={columns}
          data={productionLogs}
          actions={actions}
          getRowKey={(row) => row.id}
        />

        <DynamicPopup
          open={popupMode !== "closed"}
          onClose={handleClosePopup}
          title={popupTitle}
          maxWidth="md"
          mode={popupMode === "add" ? "add" : undefined}
          onSubmit={popupMode === "add" ? handleAddSubmit : undefined}
          isSubmitting={isSaving}
        >
          <GeneralInfoSection<ProductionLogType>
            mode={popupMode === "add" ? "form" : "view-edit"}
            showEditButton={popupMode === "edit"}
            displayFields={formFields}
            data={form.formData as ProductionLogType}
            onGeneralChange={(id, value) => {
              if (id === "team_id") {
                form.setField("team_id", value ? Number(value) : undefined);
                const label =
                  teamOptions.find((o) => o.value === value)?.label ?? "";
                form.setField("team_name", label);
              } else {
                form.setField(id, value);
              }
            }}
            errors={
              form.fieldErrors as Partial<
                Record<keyof ProductionLogType, string>
              >
            }
            disabledFields={{
              team_name: isProductTeam,
              team_id: isProductTeam,
              teams: isProductTeam,
            }}
            onSave={popupMode === "edit" ? handleEditSave : undefined}
            onCancel={() => {
              if (selectedLog) form.openEdit(selectedLog);
              else {
                form.close();
                setPopupMode("closed");
              }
            }}
          />

          {popupMode === "edit" && selectedLog?.id && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                >
                  Products List
                </Typography>
              </Divider>
              <ProductionLogDetail
                log_id={selectedLog.id}
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
    </Box>
  );
};

export default ProductionLogPage;
