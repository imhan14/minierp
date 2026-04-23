import { useCallback, useState } from "react";
import mateiralDetailApi from "@/apis/materialDetailApi";
import { useNotify } from "@/hooks/useNotify";
import type { MaterialDetailDisplay } from "@/types/MaterialDetailType";

const useMaterialReportDetailForm = (
  setEditIngredients: React.Dispatch<
    React.SetStateAction<MaterialDetailDisplay[]>
  >,
) => {
  const notify = useNotify();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalData, setOriginalData] =
    useState<MaterialDetailDisplay | null>(null);

  const startEditing = useCallback(
    (row: MaterialDetailDisplay) => {
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

  const saveEditing = useCallback(
    async (row: MaterialDetailDisplay) => {
      try {
        const payload = {
          weight: row?.weight,
          real_percent: row?.real_percent,
          note: row?.note,
        };
        await mateiralDetailApi.updateMaterialDetail(row?.id, payload);
        setEditingId(null);
        setOriginalData(null);
        notify("Cập nhật dữ liệu thành công!", "success");
      } catch (error) {
        notify("Lỗi khi nhập dữ liệu!", "error");
        console.error("Update failed", error);
      }
    },
    [notify],
  );

  return {
    startEditing,
    cancelEditing,
    saveEditing,
    editingId,
    originalData,
  };
};
export default useMaterialReportDetailForm;
