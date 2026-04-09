import GeneralInfoSection from "../../../components/GeneralInfoSection";
import { useNotify } from "../../../hooks/useNotify";
import type { OrderDisplay } from "../../../types/ProductOrderType";
import { validatePayload } from "../../../utils/validate";
import dayjs from "dayjs";
import type { FieldConfig } from "../../../types/FieldConfig";
import { orderValidateSchema } from "../../../validate/order.validate";
import { orderColumnSchema } from "../../../schema/orders.schema";
import { useEffect, useState } from "react";
import formulaApi from "../../../apis/formulaApi";
import type { FormulaType } from "../../../types/FormulaType";

interface Props {
  selectedOrder: OrderDisplay | null;
  editGeneral: OrderDisplay | null;
  onEditGeneral: (editGeneral: OrderDisplay | null) => void;
  onSaveSuccess: () => void;
}

const OrderGeneral = ({
  selectedOrder,
  onSaveSuccess,
  editGeneral,
  onEditGeneral,
}: Props) => {
  const notify = useNotify();
  const [formula, setFormula] = useState<FormulaType[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdminRole = [1, 2, 3, 4, 5].includes(Number(user.role));
  const isCanceled = selectedOrder?.status === "cancel";
  const canShowEdit = isAdminRole && !isCanceled;

  const orderDetail: FieldConfig<OrderDisplay>[] = [
    { ...orderColumnSchema.order_date },
    {
      ...orderColumnSchema.formula_name,
      inputType: "autocomplete",
      optionsAutoComplete: formula,
      getOptionLabel: (option: FormulaType) => option.formula_name,
      isOptionEqualToValue: (option: FormulaType, value) => {
        const valId = typeof value === "object" ? value.formula_id : value;
        return String(option.formula_id) === String(valId);
      },
      render: (val, row) => {
        const currentFormula = formula.find(
          (f) => String(f.formula_id) === String(val),
        );
        return currentFormula
          ? currentFormula.formula_name
          : row.formula_name || "-";
      },
    },
    { ...orderColumnSchema.team_name },
    { ...orderColumnSchema.product_shift },
    { ...orderColumnSchema.target_quantity },
    { ...orderColumnSchema.urea_rate },
    { ...orderColumnSchema.status },
    { ...orderColumnSchema.input_temprature_1 },
    { ...orderColumnSchema.output_temprature_1 },
    { ...orderColumnSchema.input_temprature_2 },
    { ...orderColumnSchema.output_temprature_2 },
  ];

  const fetchIngredientList = async () => {
    try {
      // setDetailLoading(true);
      const response = await formulaApi.getAllFormula();

      setFormula(response.data);
      // setError(null);
    } catch (err) {
      // setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!");
      console.error("API Error:", err);
    } finally {
      // setDetailLoading(false);
    }
  };

  const handleGeneralChange = (field: keyof OrderDisplay, value: string) => {
    if (editGeneral) {
      onEditGeneral({ ...editGeneral, [field]: value });
    }
  };
  const handleSave = async () => {
    if (!editGeneral) return;
    const { isValid, message, data } = validatePayload(
      orderValidateSchema,
      editGeneral,
    );
    if (!isValid) {
      onEditGeneral(selectedOrder);
      return notify(message || "Dữ liệu không hợp lệ", "error");
    }
    try {
      const isValidDate = (date: string | undefined) => {
        if (!date) return undefined;
        const d = dayjs(date);
        return d.isValid() ? d.format("DD-MM-YYYY") : undefined;
      };
      const payload = {
        order_date: isValidDate(editGeneral?.order_date),
        formula_id: data?.formula_id ?? undefined,
        team_id: data?.team_id ?? undefined,
        product_shift: data?.product_shift ?? undefined,
        target_quantity: data?.target_quantity ?? undefined,
        status: data?.status ?? undefined,
        urea_rate: data?.urea_rate ?? undefined,
        input_temprature_1: data?.input_temprature_1 ?? undefined,
        input_temprature_2: data?.input_temprature_2 ?? undefined,
        output_temprature_1: data?.output_temprature_1 ?? undefined,
        output_temprature_2: data?.output_temprature_2 ?? undefined,
        order_note: data?.order_note ?? undefined,
        created_by: data?.created_by ?? undefined,
      };
      //   await productionLogApi.updateProductionLog(editGeneral?.id, payload);
      notify("Cập nhật dữ liệu thành công!", "success");
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedOrder);
      notify("Lỗi khi nhập dữ liệu!", "error");
    }
  };

  useEffect(() => {
    fetchIngredientList();
  }, []);
  return (
    <GeneralInfoSection
      title="General"
      displayFields={orderDetail}
      data={editGeneral ?? selectedOrder}
      onGeneralChange={handleGeneralChange}
      onSave={handleSave}
      onCancel={() => onEditGeneral(selectedOrder)}
      showEditButton={canShowEdit}
    />
  );
};

export default OrderGeneral;
