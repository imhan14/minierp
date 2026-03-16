import type { FieldConfig } from "../../../types/FieldConfig";
import {
  materialReportSchema,
  type MaterialReportDisplay,
} from "../../../schema/materialReport.schema";
import dayjs from "dayjs";
import GeneralInfoSection from "../../../components/GeneralInfoSection";
import api from "../../../apis/axios";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";

interface Props {
  selectedMaterial: MaterialReportDisplay | null;
  editGeneral: MaterialReportDisplay | null;
  onEditGeneral: (on: MaterialReportDisplay | null) => void;
  onSaveSuccess: () => void;
}

const MaterialReportGeneralSection = ({
  selectedMaterial,
  onSaveSuccess,
  editGeneral,
  onEditGeneral,
}: Props) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const fieldsDetail: FieldConfig<MaterialReportDisplay>[] = [
    { ...materialReportSchema.team_name, gridSize: { md: 4 } },
    {
      ...materialReportSchema.report_date,
      gridSize: { md: 4 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    {
      ...materialReportSchema.shift,
      gridSize: { md: 4 },
      // inputType: "select",
      // options: [
      //   { label: "C1x8", value: "C1x8" },
      //   { label: "C1x12", value: "C1x12" },
      //   { label: "C2x8", value: "C2x8" },
      //   { label: "C2x12", value: "C2x12" },
      //   { label: "C3x8", value: "C3x8" },
      // ],
    },
    {
      ...materialReportSchema.start_time,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    {
      ...materialReportSchema.end_time,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
  ];
  const handleGeneralChange = (
    field: keyof MaterialReportDisplay,
    value: string,
  ) => {
    if (editGeneral) {
      onEditGeneral({ ...editGeneral, [field]: value });
    }
  };
  const handleSave = async () => {
    try {
      const payload = {
        foreman_check: editGeneral?.foreman_check,
        start_time: dayjs(editGeneral?.start_time).format("DD-MM-YYYY HH:mm"),
        end_time: dayjs(editGeneral?.end_time).format("DD-MM-YYYY HH:mm"),
      };
      console.log(payload);
      await api.patch(`/material-report/${editGeneral?.id}`, payload);
      setSnackbar({
        open: true,
        message: "Cập nhật dữ liệu thành công!",
        severity: "success",
      });
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedMaterial);
      setSnackbar({
        open: true,
        message: "Lỗi khi nhập dữ liệu!",
        severity: "error",
      });
    }
  };
  return (
    <>
      <GeneralInfoSection
        title="General"
        displayFields={fieldsDetail}
        data={editGeneral ?? selectedMaterial}
        onGeneralChange={handleGeneralChange}
        onSave={handleSave}
        onCancel={() => onEditGeneral(selectedMaterial)}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MaterialReportGeneralSection;
