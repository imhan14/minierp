import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Filters from "@components/Filters";
import DataTable, { type ActionConfig } from "@components/DataTable";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  CreateProductionReportSchema,
  UpdateProductionReportSchema,
  type ProductionReportCreatePayload,
  type ProductionReportType,
  type ProductionReportUpdatePayload,
} from "@/schema/productionReport.schema";
import DynamicPopup from "@components/DynamicPopup";
import teamApi from "@/apis/teamApi";
import type { TeamType } from "@/schema/team.schema";
import productionReportApi, {
  type ProductionReportFilter,
} from "@/apis/productionReportApi";
import { useEntity } from "@/hooks/useEntity";
import { usePageForm } from "@/hooks/usePageForm";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import {
  PRODUCTION_REPORT_ADD_FIELDS,
  PRODUCTION_REPORT_EDIT_FIELDS,
  PRODUCTION_REPORT_FIELD_CONFIGS,
  PRODUCTION_REPORT_TABLE_FIELDS,
} from "./utils/ProductionReport.fieldConfig";
import ProductListDetail from "./components/ProductListDetail";
import { DrawerHeader } from "@/utils/others";

const ProductionReportPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isProductTeam = [1, 2, 3].includes(currentUser.team_id);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [teamOptions, setTeamOptions] = useState<
    { label: string; value: string }[]
  >([]);
  useEffect(() => {
    let isMounted = true;
    const fetchTeamList = async () => {
      try {
        const response = await teamApi.getAllteams();
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
  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: productionReports, reload } = useEntity<
    ProductionReportType,
    ProductionReportType,
    ProductionReportFilter
  >(productionReportApi.getAllProductionReports);
  useEffect(() => {
    if (filterMode === "single" && selectedDate)
      reload({ date: selectedDate.format("YYYY-MM-DD") });
    else if (filterMode === "range" && selectedDate && endDate)
      reload({
        startDate: selectedDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      });
  }, [selectedDate, endDate, filterMode]);

  const {
    form,
    popupMode,
    selectedRecord: selectedLog,
    isSaving,
    confirmOpen,
    handleDiscard,
    handleContinueEditing,
    handleOpenEdit,
    handleOpenAdd,
    handleClosePopup,
    handleAddSubmit,
    handleEditSave,
    setPopupMode,
    setConfirmOpen,
  } = usePageForm<
    ProductionReportType,
    ProductionReportCreatePayload,
    ProductionReportUpdatePayload
  >({
    service: {
      create: productionReportApi.createProductionReport,
      update: productionReportApi.updateProductReport,
      // delete: productionReportApi.deleteProductionLog,
    },
    createSchema: CreateProductionReportSchema,
    updateSchema: UpdateProductionReportSchema,
    defaultValues: {
      report_date: dayjs().format("YYYY-MM-DD"),
      team_id: currentUser.team_id ? (currentUser.team_id ?? 0) : "",
      team_name:
        currentUser.team_name.length > 0
          ? currentUser.team_name[0].team_name
          : "",
    },
    messages: {
      createSuccess: "Thêm báo cáo thành công!",
      updateSuccess: "Cập nhật thành công!",
    },
    // flatten teams nested object
    // flattenResponse: (raw) => ({
    //   ...raw,
    //   team_id: raw.teams?.id ?? raw.team_id,
    //   team_name: raw.teams?.team_name ?? raw.team_name,
    // }),
    onSuccess: reload,
  });
  const handleAdd = () => {
    handleOpenAdd(
      isProductTeam ? { team_id: Number(currentUser.team_id) } : undefined,
    );
  };
  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(() => {
    const dynamicColumns = PRODUCTION_REPORT_TABLE_FIELDS.map((key) => {
      const cfg = PRODUCTION_REPORT_FIELD_CONFIGS[key]!;
      return {
        id: key as keyof ProductionReportType | "actions",
        label: cfg.label,
        // width: FIELD_WIDTHS[key],
        render: cfg.render
          ? (value: unknown) =>
              cfg.render!(value as never, {} as ProductionReportType)
          : (value: unknown) => (value != null ? String(value) : "-"),
      };
    });
    return [...dynamicColumns, { id: "actions" as const, label: "Thao tác" }];
  }, []);
  // ── Form fields ───────────────────────────────────────────────────────────
  const formFields = useMemo(() => {
    const fields =
      popupMode === "add"
        ? PRODUCTION_REPORT_ADD_FIELDS
        : PRODUCTION_REPORT_EDIT_FIELDS;
    return fields.map((key) => {
      const f = PRODUCTION_REPORT_FIELD_CONFIGS[key]!;
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
  const actions = (): ActionConfig<ProductionReportType>[] => [
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
              onClick={handleAdd}
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
          data={productionReports}
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
          <GeneralInfoSection<ProductionReportType>
            mode={popupMode === "add" ? "form" : "view-edit"}
            showEditButton={popupMode === "edit"}
            displayFields={formFields}
            data={form.formData as ProductionReportType}
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
                Record<keyof ProductionReportType, string>
              >
            }
            disabledFields={{
              team_name: isProductTeam,
              team_id: isProductTeam,
              teams: isProductTeam,
              warehouse_check: isProductTeam,
              production_check: isProductTeam,
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
              <ProductListDetail
                report_id={selectedLog.id}
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

export default ProductionReportPage;
