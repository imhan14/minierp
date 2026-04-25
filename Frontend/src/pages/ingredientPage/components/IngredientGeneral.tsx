import GeneralInfoSection from "@components/GeneralInfoSection";
import { useNotify } from "@/hooks/useNotify";
import { validateWithZod } from "@/utils/validate";
import type { IngredientType } from "@/types/IngredientType";
import { useMemo } from "react";
import { getFieldConfigs } from "@/utils/schema-parser";
import { IngredientSchema } from "@/schema/ingredient.schema";
import ingredientApi from "@/apis/ingredientApi";

interface Props {
  selectedIngredient: IngredientType | null;
  editGeneral: IngredientType | null;
  onEditGeneral: (editGeneral: IngredientType | null) => void;
  onSaveSuccess: () => void;
}

const IngredientGeneral = ({
  selectedIngredient,
  onSaveSuccess,
  editGeneral,
  onEditGeneral,
}: Props) => {
  const notify = useNotify();

  const fieldsDetail = useMemo(() => {
    const configs = getFieldConfigs(IngredientSchema);

    return configs
      .filter((f) => f.name !== "id")
      .map((f) => ({
        id: f.name,
        label: f.label,
        inputType: f.type,
        options: f.options,
        gridSize: { md: 6 },
      }));
  }, []);
  const handleGeneralChange = (field: keyof IngredientType, value: string) => {
    if (editGeneral) {
      onEditGeneral({ ...editGeneral, [field]: value });
    }
  };
  const handleSave = async () => {
    if (!editGeneral) return;
    console.log(editGeneral);
    const { isValid, message, data } = validateWithZod(
      IngredientSchema,
      editGeneral,
    );
    if (!isValid) {
      onEditGeneral(selectedIngredient);
      return notify(message || "Dữ liệu không hợp lệ", "error");
    }
    try {
      const payload = {
        ingerdient_code: data?.ingredient_code,
        ingredient_name: data?.ingredient_name,
        unit: data?.unit,
        description: data?.description,
      };
      await ingredientApi.update(editGeneral?.id, payload);
      notify("Cập nhật dữ liệu thành công!", "success");
      onSaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      onEditGeneral(selectedIngredient);
      notify("Lỗi khi nhập dữ liệu!", "error");
    }
  };

  return (
    <GeneralInfoSection
      title="General"
      displayFields={fieldsDetail}
      data={editGeneral ?? selectedIngredient}
      onGeneralChange={handleGeneralChange}
      onSave={handleSave}
      onCancel={() => onEditGeneral(selectedIngredient)}
    />
  );
};

export default IngredientGeneral;
