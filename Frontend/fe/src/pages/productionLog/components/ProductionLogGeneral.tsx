import type { ProductionLogDisplay } from "../../../types/ProductionLogType";
import GeneralInfoSection from "../../../components/GeneralInfoSection";
import { productionLogSchema } from "../../../schema/productionLog.schema";
import type { FieldConfig } from "../../../types/FieldConfig";
import { useNotify } from "../../../hooks/useNotify";
import dayjs from "dayjs";
import { validatePayload } from "../../../utils/validate";
import { updateProductLogGeneralSchema } from "../../../validate/productionLog.validate";
import productionLogApi from "../../../apis/productionLogApi";

interface Props {
  selectedLog: ProductionLogDisplay | null;
  editGeneral: ProductionLogDisplay | null;
  onEditGeneral: (editGeneral: ProductionLogDisplay | null) => void;
  onSaveSuccess: () => void;
}

const ProductionLogGeneral = ({
  selectedLog,
  onSaveSuccess,
  editGeneral,
  onEditGeneral,
}: Props) => {
  const notify = useNotify();

  const fieldsDetail: FieldConfig<ProductionLogDisplay>[] = [
    { ...productionLogSchema.team_name, gridSize: { md: 3 } },
    {
      ...productionLogSchema.log_date,
      gridSize: { md: 3 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY");
      }) as FieldConfig<ProductionLogDisplay>["render"],
    },
    { ...productionLogSchema.electric_production, gridSize: { md: 3 } },
    { ...productionLogSchema.electric_mix, gridSize: { md: 3 } },
    {
      ...productionLogSchema.log_start,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      }) as FieldConfig<ProductionLogDisplay>["render"],
    },
    {
      ...productionLogSchema.log_end,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      }) as FieldConfig<ProductionLogDisplay>["render"],
    },
    { ...productionLogSchema.number_of_employee, gridSize: { md: 3 } },
    { ...productionLogSchema.on_work, gridSize: { md: 3 } },
    { ...productionLogSchema.unauthorized_absence, gridSize: { md: 3 } },
    { ...productionLogSchema.authorized_absence, gridSize: { md: 3 } },
    { ...productionLogSchema.ht_di, gridSize: { md: 3 } },
    { ...productionLogSchema.ht_den, gridSize: { md: 3 } },
    { ...productionLogSchema.forklift, gridSize: { md: 3 } },
    { ...productionLogSchema.shift_leader, gridSize: { md: 3 } },
  ];

  const handleGeneralChange = (
    field: keyof ProductionLogDisplay,
    value: string,
  ) => {
    if (editGeneral) {
      onEditGeneral({ ...editGeneral, [field]: value });
    }
  };
  const handleSave = async () => {
    if (!editGeneral) return;
    const { isValid, message, data } = validatePayload(
      updateProductLogGeneralSchema,
      editGeneral,
    );
    if (!isValid) {
      onEditGeneral(selectedLog);
      return notify(message || "Dữ liệu không hợp lệ", "error");
    }
    try {
      const isValidDate = (date: string | undefined) => {
        if (!date) return undefined;
        const d = dayjs(date);
        return d.isValid() ? d.format("DD-MM-YYYY HH:mm") : undefined;
      };
      const payload = {
        electric_production: data?.electric_production ?? undefined,
        electric_mix: data?.electric_mix ?? undefined,
        log_start: isValidDate(editGeneral?.log_start),
        log_end: isValidDate(editGeneral?.log_end),
        number_of_employee: data?.number_of_employee ?? undefined,
        on_work: data?.on_work ?? undefined,
        unauthorized_absence: data?.unauthorized_absence ?? undefined,
        authorized_absence: data?.authorized_absence ?? undefined,
        ht_di: data?.ht_di ?? undefined,
        ht_den: data?.ht_den ?? undefined,
        forklift: data?.forklift ?? undefined,
        shift_leader: data?.shift_leader ?? undefined,
      };
      await productionLogApi.updateProductionLog(editGeneral?.id, payload);
      notify("Cập nhật dữ liệu thành công!", "success");
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedLog);
      notify("Lỗi khi nhập dữ liệu!", "error");
    }
  };

  return (
    <GeneralInfoSection
      title="General"
      displayFields={fieldsDetail}
      data={editGeneral ?? selectedLog}
      onGeneralChange={handleGeneralChange}
      onSave={handleSave}
      onCancel={() => onEditGeneral(selectedLog)}
    />
  );
};

export default ProductionLogGeneral;
