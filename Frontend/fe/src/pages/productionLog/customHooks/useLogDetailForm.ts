import { useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import dayjs from "dayjs";
import type { ProductionLogDetailType } from "../../../types/ProductionLogDetailType";
import productionLogDetailApi from "../../../apis/productionLogDetailApi";

export const useLogDetailForm = (
  log_id: number | null,
  onSaveSuccess: () => void,
) => {
  const notify = useNotify();
  const [logDetail, setLogDetail] = useState<ProductionLogDetailType[]>([]);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [originalData, setOriginalData] =
    useState<ProductionLogDetailType | null>(null);

  const isDirty = () => {
    if (!editingId) return false;
    const currentData = logDetail.find((p) => p.id === editingId);
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
      setLogDetail((prev) =>
        prev.map((p) => (p.id === editingId ? originalData : p)),
      );
      if (originalData.isNew) {
        setLogDetail((prev) => prev.filter((p) => p.id !== editingId));
      }
    }
    setShowConfirmDialog(false);
    if (pendingAction) pendingAction();
  };

  const handleSaveAndContinue = async () => {
    const currentRow = logDetail.find((p) => p.id === editingId);
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
      setLogDetail((prev) =>
        prev.map((item) => (item.id === originalData.id ? originalData : item)),
      );
    }
    setEditingId(null);
    setOriginalData(null);
  };
  const deleteRowWithGuard = (row: ProductionLogDetailType) => {
    guardAction(async () => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
      try {
        await productionLogDetailApi.deleteProductionLogDetail(row.id);
        setLogDetail((prev) => prev.filter((item) => item.id !== row.id));
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
    setLogDetail((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: [
                "quantity",
                "pkg_received",
                "pkg_returned",
                "pkg_damaged",
              ].includes(field)
                ? (value === "" ? 0 : Number(value)) || 0
                : value,
            }
          : item,
      ),
    );
  };
  const saveEditing = async (row: ProductionLogDetailType) => {
    try {
      const isValidDate = (date: string | undefined) => {
        const d = dayjs(date);
        return d.isValid() ? d.format("DD-MM-YYYY HH:mm") : undefined;
      };
      const payload = {
        production_log_id: Number(log_id) || undefined,
        start_time: isValidDate(row.start_time),
        end_time: isValidDate(row.end_time),
        task_type: row.task_type || undefined,
        content: row.content || undefined,
        quantity: Number(row.quantity) || undefined,
        product_type: row.product_type || undefined,
        pkg_received: Number(row.pkg_received) || undefined,
        pkg_returned: Number(row.pkg_returned) || undefined,
        pkg_damaged: Number(row.pkg_damaged) || undefined,
      };
      if (row.isNew)
        await productionLogDetailApi.createProductionLogDetail(payload);
      else
        await productionLogDetailApi.updateProductionLogDetail(row.id, payload);
      setEditingId(null);
      notify("Cập nhật thành công!", "success");
      onSaveSuccess();
    } catch (error) {
      notify("Lỗi khi lưu dữ liệu!", "error");
      console.error(error);
    }
  };
  const startEditing = (row: ProductionLogDetailType) => {
    guardAction(() => {
      setEditingId(row.id);
      setOriginalData({ ...row });
    });
  };
  const handleAddNewRow = () => {
    guardAction(() => {
      const newRow: ProductionLogDetailType = {
        production_log_id: 0,
        isNew: true,
        id: `new-${Date.now()}`,
        start_time: "",
        end_time: "",
        task_type: "",
        content: "",
        quantity: 0,
        product_type: "",
        pkg_returned: 0,
        pkg_received: 0,
        pkg_damaged: 0,
      };
      setLogDetail((prev) => [newRow, ...prev]);
      setEditingId(newRow.id);
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
    logDetail,
    setLogDetail,
  };
};
