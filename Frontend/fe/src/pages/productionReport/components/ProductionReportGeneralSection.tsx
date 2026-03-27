import GeneralInfoSection from "../../../components/GeneralInfoSection";
import {
  productionReportSchema,
  type ProductionReportDisplay,
} from "../../../schema/productionReport.schema";
import type { FieldConfig } from "../../../types/FieldConfig";
import dayjs from "dayjs";
import { useNotify } from "../../../hooks/useNotify";
import productionReportApi from "../../../apis/productionReportApi";
import { updateGeneralSchema } from "../../../validate/productionReport.validate";
import { validatePayload } from "../../../utils/validate";

interface Props {
  selectedMaterial: ProductionReportDisplay | null;
  editGeneral: ProductionReportDisplay | null;
  onEditGeneral: (editGeneral: ProductionReportDisplay | null) => void;
  onSaveSuccess: () => void;
}

const ProductionReportGeneralSection = ({
  selectedMaterial,
  onSaveSuccess,
  editGeneral,
  onEditGeneral,
}: Props) => {
  const notify = useNotify();

  const fieldsDetail: FieldConfig<ProductionReportDisplay>[] = [
    { ...productionReportSchema.team_name, gridSize: { md: 3 } },
    {
      ...productionReportSchema.report_date,
      gridSize: { md: 3 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY");
      }) as FieldConfig<ProductionReportDisplay>["render"],
    },
    {
      ...productionReportSchema.shift,
      gridSize: { md: 3 },
      inputType: "select",
      options: [
        { label: "C1x8", value: "C1x8" },
        { label: "C1x12", value: "C1x12" },
        { label: "C2x8", value: "C2x8" },
        { label: "C2x12", value: "C2x12" },
        { label: "C3x8", value: "C3x8" },
      ],
    },
    { ...productionReportSchema.furnace, gridSize: { md: 3 } },
    {
      ...productionReportSchema.start_time,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      }) as FieldConfig<ProductionReportDisplay>["render"],
    },
    {
      ...productionReportSchema.end_time,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      }) as FieldConfig<ProductionReportDisplay>["render"],
    },
  ];
  const handleGeneralChange = (
    field: keyof ProductionReportDisplay,
    value: string,
  ) => {
    if (editGeneral) {
      onEditGeneral({ ...editGeneral, [field]: value });
    }
  };
  const handleSave = async () => {
    if (!editGeneral) return;
    const { isValid, message } = validatePayload(
      updateGeneralSchema,
      editGeneral,
    );
    if (!isValid) {
      onEditGeneral(selectedMaterial);
      return notify(message || "Dữ liệu không hợp lệ", "error");
    }
    try {
      const isValidDate = (date: string | undefined) => {
        const d = dayjs(date);
        return d.isValid() ? d.format("DD-MM-YYYY HH:mm") : undefined;
      };
      const payload = {
        furnace: editGeneral?.furnace ?? undefined,
        start_time: isValidDate(editGeneral?.start_time),
        end_time: isValidDate(editGeneral?.end_time),
        shift: editGeneral?.shift ?? undefined,
      };

      await productionReportApi.updateProductReport(editGeneral?.id, payload);
      notify("Cập nhật dữ liệu thành công!", "success");
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedMaterial);
      notify("Lỗi khi nhập dữ liệu!", "error");
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

export default ProductionReportGeneralSection;
