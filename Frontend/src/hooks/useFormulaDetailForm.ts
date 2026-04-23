import { useState } from "react";
import { useNotify } from "@/hooks/useNotify";
import type { FormulaDetailDisplay } from "@/types/FormulaDetailType";
import formulaDetailApi from "@/apis/formulaDetailApi";

export const useFormulaDetailForm = (
  formula_id: number | null,
  onSaveSuccess: () => void,
  data: FormulaDetailDisplay[],
  setData: React.Dispatch<React.SetStateAction<FormulaDetailDisplay[]>>,
) => {
  const notify = useNotify();
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [originalData, setOriginalData] = useState<FormulaDetailDisplay | null>(
    null,
  );

  const isDirty = () => {
    if (!editingId) return false;
    const currentData = data.find((p) => p.id === editingId);
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  const guardAction = (action: () => void) => {
    if (isDirty()) {
      setPendingAction(() => action);
      setShowConfirmDialog(true);
    } else {
      action();
    }
  };
  const handleDiscardChanges = () => {
    if (editingId && originalData) {
      setData((prev) =>
        prev.map((p) => (p.id === editingId ? originalData : p)),
      );
      if (originalData.isNew) {
        setData((prev) => prev.filter((p) => p.id !== editingId));
      }
    }
    setShowConfirmDialog(false);
    if (pendingAction) pendingAction();
  };

  const handleSaveAndContinue = async () => {
    const currentRow = data.find((p) => p.id === editingId);
    if (currentRow) {
      try {
        await saveEditing(currentRow);
        setShowConfirmDialog(false);
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      } catch (error) {
        console.error("Save failed, staying in dialog", error);
      }
    }
  };

  const cancelEditing = () => {
    if (originalData) {
      setData((prev) =>
        prev.map((item) => (item.id === originalData.id ? originalData : item)),
      );
    }
    setEditingId(null);
    setOriginalData(null);
  };
  const deleteRowWithGuard = (row: FormulaDetailDisplay) => {
    guardAction(async () => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
      try {
        // await productionLogDetailApi.deleteProductionLogDetail(row.id);
        setData((prev) => prev.filter((item) => item.id !== row.id));
        notify("Xóa thành công!", "success");
        onSaveSuccess();
      } catch (error) {
        notify("Lỗi khi xóa!", "error");
        console.error(error);
      }
    });
  };

  const handleDetailChange = (
    id: number | string,
    field: string,
    value: string | null | number,
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: ["target_quantity"].includes(field)
                ? (value === "" ? 0 : Number(value)) || 0
                : value,
            }
          : item,
      ),
    );
  };
  const saveEditing = async (row: FormulaDetailDisplay) => {
    try {
      if (row.isNew && !row.ingredient_id) {
        notify("Vui lòng chọn ingredient!", "warning");
        return;
      }
      const payload = {
        ingredient_id: row.ingredient_id || undefined,
        standard_quality: row.standard_quality || undefined,
        formula_id: formula_id || undefined,
      };
      if (row.isNew) await formulaDetailApi.createFormulaDetail(payload);
      else await formulaDetailApi.updateFormulaDetail(Number(row.id), payload);
      setEditingId(null);
      notify("Cập nhật thành công!", "success");
      onSaveSuccess();
    } catch (error) {
      notify("Lỗi khi lưu dữ liệu!", "error");
      console.error(error);
    }
  };
  const startEditing = (row: FormulaDetailDisplay) => {
    guardAction(() => {
      setEditingId(row.id);
      setOriginalData({ ...row });
    });
  };
  const handleAddNewRow = () => {
    guardAction(() => {
      const newRow: FormulaDetailDisplay = {
        ingredient_id: 0,
        ingredient_name: "",
        isNew: true,
        id: `new-${Date.now()}`,
        standard_quality: 0,
        formula_id: 0,
        unit: "",
      };
      setData((prev) => [newRow, ...prev]);
      setEditingId(newRow.id);
      setOriginalData({ ...newRow });
    });
  };
  return {
    editingId,
    showConfirmDialog,
    setShowConfirmDialog,
    handleDiscardChanges,
    handleDetailChange,
    handleSaveAndContinue,
    cancelEditing,
    saveEditing,
    deleteRowWithGuard,
    startEditing,
    handleAddNewRow,
  };
};
