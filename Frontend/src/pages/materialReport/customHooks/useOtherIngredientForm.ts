import { useCallback, useState } from "react";
import { useNotify } from "@/hooks/useNotify";
import type { ExtraMaterialsJson } from "@/types/MaterialReportType";
import materialReportApi from "@/apis/materialReportApi";

const useOtherIngredientForm = (
  material_id: number | undefined,
  onSaveSuccess: () => void,
  editIngredients: ExtraMaterialsJson[],
  setEditIngredients: React.Dispatch<
    React.SetStateAction<ExtraMaterialsJson[]>
  >,
) => {
  const notify = useNotify();
  const [editingId, setEditingId] = useState<
    number | null | string | undefined
  >(null);
  const [originalData, setOriginalData] = useState<ExtraMaterialsJson | null>(
    null,
  );

  const startEditing = useCallback(
    (row: ExtraMaterialsJson) => {
      if (editingId !== null && editingId !== row.id && originalData) {
        setEditIngredients((prev) =>
          prev.map((item) =>
            item.id === originalData.id ? originalData : item,
          ),
        );
      }
      setEditingId(row.id);
      setOriginalData({ ...row });
    },
    [editingId, originalData, setEditIngredients],
  );

  const cancelEditing = useCallback(() => {
    if (originalData) {
      setEditIngredients((prev) =>
        prev.map((item) => (item.id === originalData.id ? originalData : item)),
      );
    }
    setEditingId(null);
    setOriginalData(null);
  }, [originalData, setEditIngredients]);

  const saveEditing = async (row: ExtraMaterialsJson) => {
    try {
      const updatedList = editIngredients.map((item) =>
        item.id === row.id ? row : item,
      );
      await materialReportApi.updateMaterialReport(material_id, {
        extral_materials: updatedList,
      });
      setEditingId(null);
      setOriginalData(null);
      onSaveSuccess();
      notify("Cập nhật dữ liệu thành công!", "success");
    } catch (error) {
      notify("Lỗi khi nhập dữ liệu!", "error");
      console.error("Update failed", error);
    }
  };
  const handleAddNewRow = () => {
    const newRow: ExtraMaterialsJson = {
      id: Date.now(),
      ingredient_name: "",
      weight: 0,
      real_percent: 0,
      note: "",
    };
    setEditIngredients((prev) => [newRow, ...prev]);
    setEditingId(newRow.id);
  };
  const handleDeleteRow = async (row: ExtraMaterialsJson) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) return;
    try {
      const updatedList = editIngredients.filter((item) => item.id !== row.id);
      await materialReportApi.updateMaterialReport(material_id, {
        extral_materials: updatedList,
      });
      setEditIngredients(updatedList);

      notify("Xóa thành công!", "success");
      onSaveSuccess();
    } catch (error) {
      notify("Lỗi khi xóa!", "error");
      console.error(error);
    }
  };
  return {
    handleAddNewRow,
    startEditing,
    cancelEditing,
    saveEditing,
    editingId,
    originalData,
    handleDeleteRow,
  };
};
export default useOtherIngredientForm;
