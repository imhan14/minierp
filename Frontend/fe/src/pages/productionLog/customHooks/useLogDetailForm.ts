import { useState } from "react";

export const useLogDetailForm = (
  log_id: number | null,
  onSaveSuccess: () => void,
) => {
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const handleDiscardChanges = () => {
    if (editingId && originalData) {
      setEditProducts((prev) =>
        prev.map((p) => (p.id === editingId ? originalData : p)),
      );
      if (originalData.isNew) {
        setEditProducts((prev) => prev.filter((p) => p.id !== editingId));
      }
    }
    setShowConfirmDialog(false);
    if (pendingAction) pendingAction();
  };

  const handleSaveAndContinue = async () => {
    const currentRow = editProducts.find((p) => p.id === editingId);
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
      setEditProducts((prev) =>
        prev.map((item) => (item.id === originalData.id ? originalData : item)),
      );
    }
    setEditingId(null);
    setOriginalData(null);
  };
  const deleteRowWithGuard = (row: ProductionReportDetailDisplay) => {
    guardAction(async () => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
      try {
        await productionReportDetailApi.deleteProductionReportDetailApi(row.id);
        setEditProducts((prev) => prev.filter((item) => item.id !== row.id));
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
    setEditProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "weight" ? Number(value) || 0 : value,
            }
          : item,
      ),
    );
  };
  const saveEditing = async (row: ProductionReportDetailDisplay) => {
    try {
      const isValidDate = (date: string | undefined) => {
        const d = dayjs(date);
        return d.isValid() ? d.format("DD-MM-YYYY HH:mm") : undefined;
      };
      const payload = {
        product_id: Number(row.product_id) || undefined,
        report_id: report_id || undefined,
        is_finish: String(row.is_finish) || undefined,
        type_of_specification: row.type_of_specification || undefined,
        product_line: row.product_line || undefined,
        specification: row.specification || undefined,
        start_time: isValidDate(row.start_time),
        end_time: isValidDate(row.end_time),
        weight: Number(row.weight) || undefined,
        note: row.note || undefined,
      };
      if (row.isNew)
        await productionReportDetailApi.createProductionReportDetail(payload);
      else
        await productionReportDetailApi.updateProductionReportDetail(
          row.id,
          payload,
        );
      setEditingId(null);
      notify("Cập nhật thành công!", "success");
      onSaveSuccess();
    } catch (error) {
      notify("Lỗi khi lưu dữ liệu!", "error");
      console.error(error);
    }
  };
  return { editingId };
};
