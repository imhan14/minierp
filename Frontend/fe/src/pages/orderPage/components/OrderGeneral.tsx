import GeneralInfoSection from "../../../components/GeneralInfoSection";
import { useNotify } from "../../../hooks/useNotify";
import type { OrderDisplay } from "../../../types/ProductOrderType";
import { validatePayload } from "../../../utils/validate";
import dayjs from "dayjs";
import type { FieldConfig } from "../../../types/FieldConfig";
import { orderValidateSchema } from "../../../validate/order.validate";
import { orderColumnSchema } from "../../../schema/orders.schema";
import { useEffect, useMemo, useState } from "react";
import formulaApi from "../../../apis/formulaApi";
import type { FormulaType } from "../../../types/FormulaType";
import productOrderApi from "../../../apis/productOrderApi";

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
  const [formula, setFormula] = useState<{ label: string; value: string }[]>(
    [],
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdminRole = [1, 2, 3, 4, 5].includes(Number(user.role));
  const isCanceled = selectedOrder?.status === "cancel";
  const canShowEdit = isAdminRole && !isCanceled;

  const orderDetail: FieldConfig<OrderDisplay>[] = useMemo(
    () => [
      { ...orderColumnSchema.order_date },
      {
        ...orderColumnSchema.formula_id,
        label: "Formula Name",
        inputType: "autocomplete",
        optionsAutoComplete: formula,
        gridSize: { md: 6 },
        render: (_, record) => record.formula_name || "-",
        noWrap: true,
      },
      {
        ...orderColumnSchema.team_id,
        label: "Team Name",
        inputType: "select",
        options: [
          { label: "Team 1", value: "1" },
          { label: "Team 2", value: "2" },
          { label: "Team 3", value: "3" },
        ],
        render: (_, record) => record.team_name || "-",
      },
      {
        ...orderColumnSchema.product_shift,
        inputType: "select",
        options: [
          { label: "Ca1x8", value: "C1x8" },
          { label: "Ca1x12", value: "C1x12" },
          { label: "Ca2x8", value: "C2x8" },
          { label: "Ca2x12", value: "C2x12" },
          { label: "Ca3x8", value: "C3x8" },
        ],
      },
      { ...orderColumnSchema.target_quantity },
      { ...orderColumnSchema.urea_rate },
      { ...orderColumnSchema.status },
      { ...orderColumnSchema.input_temprature_1 },
      { ...orderColumnSchema.output_temprature_1 },
      { ...orderColumnSchema.input_temprature_2 },
      { ...orderColumnSchema.output_temprature_2 },
    ],
    [formula],
  );

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
        formula_id: data?.formula_id ? Number(data.formula_id) : undefined,
        team_id: data?.team_id ?? undefined,
        product_shift: data?.product_shift ?? undefined,
        target_quantity: data?.target_quantity
          ? Number(data?.target_quantity)
          : undefined,
        status: data?.status ?? undefined,
        urea_rate: data?.urea_rate ?? undefined,
        input_temprature_1: data?.input_temprature_1 ?? undefined,
        input_temprature_2: data?.input_temprature_2 ?? undefined,
        output_temprature_1: data?.output_temprature_1 ?? undefined,
        output_temprature_2: data?.output_temprature_2 ?? undefined,
        order_note: data?.order_note ?? undefined,
        created_by: data?.created_by ?? undefined,
      };

      await productOrderApi.updateOrder(editGeneral?.id, payload);

      const updatedLabel = formula.find(
        (item) => String(payload.formula_id) === String(item.value),
      )?.label;
      onEditGeneral({
        ...editGeneral,
        formula_id: payload.formula_id || 0,
        formula_name: updatedLabel || "-",
      });
      onSaveSuccess();
      notify("Cập nhật dữ liệu thành công!", "success");
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedOrder);
      notify("Lỗi khi nhập dữ liệu!", "error");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchFormulaList = async () => {
      try {
        const response = await formulaApi.getAllFormula();
        if (isMounted) {
          const formattedData = response.data.map((item: FormulaType) => ({
            label: item.formula_name,
            value: String(item.id),
          }));
          setFormula(formattedData);
        }
      } catch (err) {
        notify("Get Formula List failded", "error");
        console.error("API Error:", err);
      }
    };
    fetchFormulaList();
    return () => {
      isMounted = false;
    };
  }, [notify]);
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
