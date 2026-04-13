import type { FieldConfig } from "../../../types/FieldConfig";
import { materialReportSchema } from "../../../schema/materialReport.schema";
import dayjs from "dayjs";
import GeneralInfoSection from "../../../components/GeneralInfoSection";
import { useNotify } from "../../../hooks/useNotify";
import materialReportApi from "../../../apis/materialReportApi";
import type { MaterialReportDisplay } from "../../../types/MaterialReportType";

interface Props {
  selectedMaterial: MaterialReportDisplay | null;
  editGeneral: MaterialReportDisplay | null;
  onEditGeneral: (editGeneral: MaterialReportDisplay | null) => void;
  onSaveSuccess: () => void;
}

const MaterialReportGeneralSection = ({
  selectedMaterial,
  onSaveSuccess,
  editGeneral,
  onEditGeneral,
}: Props) => {
  const notify = useNotify();
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
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      }) as FieldConfig<MaterialReportDisplay>["render"],
    },
    {
      ...materialReportSchema.end_time,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
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
      const isValidDate = (date: string | undefined) => {
        const d = dayjs(date);
        return d.isValid() ? d.format("DD-MM-YYYY HH:mm") : undefined;
      };
      const payload = {
        foreman_check: editGeneral?.foreman_check ?? undefined,
        start_time: isValidDate(editGeneral?.start_time),
        end_time: isValidDate(editGeneral?.end_time),
        shift: editGeneral?.shift ?? undefined,
      };
      await materialReportApi.updateMaterialReport(editGeneral?.id, payload);

      notify("Cập nhật thành công", "success");
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedMaterial);
      notify("Cập nhật thất bại!", "error");
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
    </>
  );
};

export default MaterialReportGeneralSection;
