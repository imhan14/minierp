import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Filters from "@components/Filters";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DataTable, { type ActionConfig } from "@components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DynamicPopup from "@components/DynamicPopup";
import {
  CreateMaterialReportSchema,
  UpdateMaterialReportSchema,
  type MaterialReportCreatePayload,
  type MaterialReportType,
  type MaterialReportUpdatePayload,
} from "@/schema/materialReport.schema";
import { useNotify } from "@/hooks/useNotify";
import { DrawerHeader, type PopupMode } from "@/utils/others";
import teamApi from "@/apis/teamApi";
import type { TeamType } from "@/schema/team.schema";
import type { MaterialReportFilters } from "@/apis/materialReportApi";
import { useEntity } from "@/hooks/useEntity";
import materialReportApi from "@/apis/materialReportApi";
import { useEntityForm } from "@/hooks/useEntityForm";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import {
  MATERIAL_REPORT_ADD_FIELDS,
  MATERIAL_REPORT_EDIT_FIELDS,
  MATERIAL_REPORT_FIELD_CONFIGS,
  MATERIAL_REPORT_TABLE_FIELDS,
} from "./utils/materialReport.fieldconfigs";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import MaterialDetailList from "./components/MaterialDetailList";
import OtherIngredient from "./components/OtherIngredient";

const MaterialReportPage = () => {
  const notify = useNotify();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isProductTeam = [1, 2, 3].includes(currentUser.team_id);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [popupMode, setPopupMode] = useState<PopupMode>("closed");
  const [selectedLog, setSelectedLog] = useState<MaterialReportType | null>(
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
  const { data: materialReports, reload } = useEntity<
    MaterialReportType,
    MaterialReportType,
    MaterialReportFilters
  >(materialReportApi.getAllMaterialReports);
  // ── Form hook ─────────────────────────────────────────────────────────────
  const form = useEntityForm<
    MaterialReportType,
    MaterialReportCreatePayload,
    MaterialReportUpdatePayload
  >({
    service: {
      create: (payload) => materialReportApi.createMaterialReport(payload),
      update: (id, payload) =>
        materialReportApi.updateMaterialReport(id, payload),
      // delete: (id) => MaterialReportApi.deleteFormula(id),
    },
    createSchema: CreateMaterialReportSchema,
    updateSchema: UpdateMaterialReportSchema,
    toCreatePayload: (d) => {
      return d as MaterialReportCreatePayload;
    },
    toUpdatePayload: (d) => {
      const payload = d as MaterialReportUpdatePayload;
      console.log(payload);
      return payload;
    },
    defaultValues: {
      report_date: dayjs().format("YYYY-MM-DD"),
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
  const handleOpenEdit = (row: MaterialReportType) => {
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
    const parsed = CreateMaterialReportSchema.safeParse(form.formData);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      form.setFieldErrors(errors);
      return;
    }
    try {
      await materialReportApi.createMaterialReport(parsed.data);
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
    const parsed = UpdateMaterialReportSchema.safeParse(form.formData);

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
      const res = await materialReportApi.updateMaterialReport(
        selectedLog!.id!,
        parsed.data as MaterialReportUpdatePayload,
      );
      const updated = res.data as MaterialReportType;
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
    const dynamicColumns = MATERIAL_REPORT_TABLE_FIELDS.map((key) => {
      const cfg = MATERIAL_REPORT_FIELD_CONFIGS[key]!;
      return {
        id: key as keyof MaterialReportType | "actions",
        label: cfg.label,
        // width: FIELD_WIDTHS[key],
        render: cfg.render
          ? (value: unknown) =>
              cfg.render!(value as never, {} as MaterialReportType)
          : (value: unknown) => (value != null ? String(value) : "-"),
      };
    });
    return [...dynamicColumns, { id: "actions" as const, label: "Thao tác" }];
  }, []);
  // ── Form fields ───────────────────────────────────────────────────────────
  const formFields = useMemo(() => {
    const fields =
      popupMode === "add"
        ? MATERIAL_REPORT_ADD_FIELDS
        : MATERIAL_REPORT_EDIT_FIELDS;
    return fields.map((key) => {
      const f = MATERIAL_REPORT_FIELD_CONFIGS[key]!;
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
  const actions = (): ActionConfig<MaterialReportType>[] => [
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
      : `Báo cáo: ${selectedLog?.team_name ?? ""} - ${selectedLog?.report_date ? dayjs(selectedLog.report_date).format("DD/MM/YYYY") : ""}`;
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
          data={materialReports}
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
          <GeneralInfoSection<MaterialReportType>
            mode={popupMode === "add" ? "form" : "view-edit"}
            showEditButton={popupMode === "edit"}
            displayFields={formFields}
            data={form.formData as MaterialReportType}
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
                Record<keyof MaterialReportType, string>
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
              <MaterialDetailList
                material_id={selectedLog.id}
                onSaveSuccess={reload}
              />
              <Divider sx={{ my: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                >
                  Nguyên liệu ngoài danh mục
                </Typography>
              </Divider>
              <OtherIngredient
                material_id={selectedLog.id}
                extral_material={selectedLog}
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

export default MaterialReportPage;
