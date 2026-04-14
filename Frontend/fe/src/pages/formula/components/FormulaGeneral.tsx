import GeneralInfoSection from "@components/GeneralInfoSection";
import type { FieldConfig } from "@/types/FieldConfig";
import { useNotify } from "@/hooks/useNotify";
import dayjs from "dayjs";
import { validatePayload } from "@/utils/validate";
import productionLogApi from "@/apis/productionLogApi";
import type { FormulaDisplay } from "@/types/FormulaType";
import { formulaSchema } from "@/schema/formula.schema";
import { formulaValidateSchema } from "@/validate/formula.validate";

interface Props {
  selectedFormula: FormulaDisplay | null;
  editGeneral: FormulaDisplay | null;
  onEditGeneral: (editGeneral: FormulaDisplay | null) => void;
  onSaveSuccess: () => void;
}

const FormulaGeneral = ({
  selectedFormula,
  onSaveSuccess,
  editGeneral,
  onEditGeneral,
}: Props) => {
  const notify = useNotify();

  const fieldsDetail: FieldConfig<FormulaDisplay>[] = [
    { ...formulaSchema.team_name, gridSize: { md: 3 } },
    {
      ...formulaSchema.log_date,
      gridSize: { md: 3 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY");
      }) as FieldConfig<FormulaDisplay>["render"],
    },
    { ...formulaSchema.electric_production, gridSize: { md: 3 } },
    { ...formulaSchema.electric_mix, gridSize: { md: 3 } },
    {
      ...formulaSchema.log_start,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      }) as FieldConfig<FormulaDisplay>["render"],
    },
    {
      ...formulaSchema.log_end,
      inputType: "datetime-local",
      gridSize: { md: 6 },
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      }) as FieldConfig<FormulaDisplay>["render"],
    },
    { ...formulaSchema.number_of_employee, gridSize: { md: 3 } },
    { ...formulaSchema.on_work, gridSize: { md: 3 } },
    { ...formulaSchema.unauthorized_absence, gridSize: { md: 3 } },
    { ...formulaSchema.authorized_absence, gridSize: { md: 3 } },
    { ...formulaSchema.ht_di, gridSize: { md: 3 } },
    { ...formulaSchema.ht_den, gridSize: { md: 3 } },
    { ...formulaSchema.forklift, gridSize: { md: 3 } },
    { ...formulaSchema.shift_leader, gridSize: { md: 3 } },
  ];

  const handleGeneralChange = (field: keyof FormulaDisplay, value: string) => {
    if (editGeneral) {
      onEditGeneral({ ...editGeneral, [field]: value });
    }
  };
  const handleSave = async () => {
    if (!editGeneral) return;
    const { isValid, message, data } = validatePayload(
      formulaValidateSchema,
      editGeneral,
    );
    if (!isValid) {
      onEditGeneral(selectedFormula);
      return notify(message || "Dữ liệu không hợp lệ", "error");
    }
    try {
      const payload = {
        formula_name: data?.formula_name ?? undefined,
        formula_code: data?.formula_code ?? undefined,
        product_id: data?.product_id ?? undefined,
        is_active: data?.is_active ?? undefined,
        product_line: data?.product_line ?? undefined,
        specification: data?.specification ?? undefined,
        color: data?.color ?? undefined,
        type_of_specification: data?.type_of_specification ?? undefined,
      };
      //   await productionLogApi.updateProductionLog(editGeneral?.id, payload);
      notify("Cập nhật dữ liệu thành công!", "success");
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedFormula);
      notify("Lỗi khi nhập dữ liệu!", "error");
    }
  };

  return (
    <GeneralInfoSection
      title="General"
      displayFields={fieldsDetail}
      data={editGeneral ?? selectedFormula}
      onGeneralChange={handleGeneralChange}
      onSave={handleSave}
      onCancel={() => onEditGeneral(selectedFormula)}
    />
  );
};

export default FormulaGeneral;
