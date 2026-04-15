import GeneralInfoSection from "@components/GeneralInfoSection";
import type { FieldConfig } from "@/types/FieldConfig";
import { useNotify } from "@/hooks/useNotify";
import { validatePayload } from "@/utils/validate";
import type { FormulaDisplay } from "@/types/FormulaType";
import { formulaSchema } from "@/schema/formula.schema";
import { formulaValidateSchema } from "@/validate/formula.validate";
import formulaApi from "@/apis/formulaApi";
import { useEffect, useState } from "react";
import type { ProductType } from "@/types/ProductType";
import productionApi from "@/apis/productionApi";

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
  const [product, setProduct] = useState<{ label: string; value: string }[]>(
    [],
  );

  const fieldsDetail: FieldConfig<FormulaDisplay>[] = [
    { ...formulaSchema.formula_name, sx: { height: 50 }, gridSize: { md: 6 } },
    {
      ...formulaSchema.product_id,
      label: "Product Name",
      inputType: "autocomplete",
      optionsAutoComplete: product,
      gridSize: { md: 6 },
      render: (_, record) => record.product_name || "-",
      noWrap: true,
    },
    {
      ...formulaSchema.is_active,
      inputType: "select",
      options: [
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ],
      sx: { color: "red" },
    },
    {
      ...formulaSchema.product_line,
      inputType: "select",
      options: [
        { label: "Trộn", value: "tron" },
        { label: "Sang Bao", value: "sangbao" },
        { label: "1 hạt", value: "mothat" },
      ],
    },
    {
      ...formulaSchema.specification,
      inputType: "select",
      options: [{ label: "Bao thành phẩm", value: "btp" }],
    },
    {
      ...formulaSchema.color,
      inputType: "select",
      options: [
        { label: "3 màu", value: "bamau" },
        { label: "Xám", value: "xam" },
      ],
    },
    {
      ...formulaSchema.type_of_specification,
      inputType: "select",
      options: [
        { label: "25 Kg", value: "25Kg" },
        { label: "50 Kg", value: "50Kg" },
      ],
    },
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
      await formulaApi.updateFormula(editGeneral?.id, payload);
      notify("Cập nhật dữ liệu thành công!", "success");
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedFormula);
      notify("Lỗi khi nhập dữ liệu!", "error");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchFormulaList = async () => {
      try {
        const response = await productionApi.getAllProducts();
        if (isMounted) {
          const formattedData = response.data.map((item: ProductType) => ({
            label: item.product_name,
            value: String(item.id),
          }));
          setProduct(formattedData);
        }
      } catch (err) {
        notify("Get Product List failded", "error");
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
      displayFields={fieldsDetail}
      data={editGeneral ?? selectedFormula}
      onGeneralChange={handleGeneralChange}
      onSave={handleSave}
      onCancel={() => onEditGeneral(selectedFormula)}
    />
  );
};

export default FormulaGeneral;
