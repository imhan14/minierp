import React, { useState } from "react";
import type { FieldConfig } from "../../../types/FieldConfig";
import {
  materialReportSchema,
  type MaterialReportDisplay,
} from "../../../schema/materialReport.schema";
import dayjs from "dayjs";
import GeneralInfoSection from "../../../components/GeneralInfoSection";
import { Skeleton } from "@mui/material";
import api from "../../../apis/axios";

const MaterialReportGeneralSection = () => {
  const [loading, setLoading] = useState(false);
  const [editGeneral, setEditGeneral] = useState<MaterialReportDisplay | null>(
    null,
  );
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialReportDisplay | null>(null);
  const fieldsDetail: FieldConfig<MaterialReportDisplay>[] = [
    { ...materialReportSchema.team_name },
    {
      ...materialReportSchema.report_date,
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    {
      ...materialReportSchema.shift,
      inputType: "select",
      options: [
        { label: "C1x8", value: "C1x8" },
        { label: "C1x12", value: "C1x12" },
        { label: "C2x8", value: "C2x8" },
        { label: "C2x12", value: "C2x12" },
        { label: "C3x8", value: "C3x8" },
      ],
    },
    {
      ...materialReportSchema.start_time,
      inputType: "datetime-local",
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    {
      ...materialReportSchema.end_time,
      inputType: "datetime-local",
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
      setEditGeneral({ ...editGeneral, [field]: value });
    }
    console.log(editGeneral);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        general: editGeneral,
        ingredients: editIngredients,
      };

      await api.patch(`/material-report/${editGeneral?.id}`, payload);

      alert("Cập nhật thành công!");
      setOpenDetail(false);
      fetchMaterialReport(selectedDate);
    } catch (err) {
      console.error("Save error:", err);
      alert("Lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  return loading ? (
    <Skeleton variant="rounded" height={300} />
  ) : (
    <GeneralInfoSection
      title="General"
      displayFields={fieldsDetail}
      data={editGeneral ?? selectedMaterial}
      onGeneralChange={handleGeneralChange}
      onSave={handleSave}
      onCancel={() => setEditGeneral(selectedMaterial)}
    />
  );
};

export default MaterialReportGeneralSection;
