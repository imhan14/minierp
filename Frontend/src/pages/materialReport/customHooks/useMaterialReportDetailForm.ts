import { useCallback, useState } from "react";
import { useNotify } from "@/hooks/useNotify";
import materialDetailApi from "@/apis/materialDetailApi";
import type { MaterialDetailType } from "@/schema/materialDetail.schema";
import type { IngredientType } from "@/schema/ingredient.schema";

const useMaterialDetailForm = (
  material_id: number,
  rows: MaterialDetailType[],
  setRows: React.Dispatch<React.SetStateAction<MaterialDetailType[]>>,
  ingredientOptions: IngredientType[],
  onSaveSuccess: () => void,
) => {
  const notify = useNotify();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalRow, setOriginalRow] = useState<MaterialDetailType | null>(
    null,
  );
  // id dùng tạm cho pending rows chưa được save (dùng âm để tránh trùng id DB)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  // ── Editing ──────────────────────────────────────────────────────────────
  const startEditing = useCallback(
    (row: MaterialDetailType) => {
      if (editingId !== null && editingId !== row.id && originalRow) {
        setRows((prev) =>
          prev.map((r) => (r.id === originalRow.id ? originalRow : r)),
        );
      }
      setEditingId(row.id);
      setOriginalRow({ ...row });
    },
    [editingId, originalRow, setRows],
  );

  const cancelEditing = useCallback(() => {
    if (originalRow) {
      // nếu là pending row (chưa save) thì xóa hẳn
      if (pendingIds.has(originalRow.id)) {
        setRows((prev) => prev.filter((r) => r.id !== originalRow.id));
        setPendingIds((prev) => {
          const s = new Set(prev);
          s.delete(originalRow.id);
          return s;
        });
      } else {
        setRows((prev) =>
          prev.map((r) => (r.id === originalRow.id ? originalRow : r)),
        );
      }
    }
    setEditingId(null);
    setOriginalRow(null);
  }, [originalRow, pendingIds, setRows]);

  // ── Save (create hoặc update) ─────────────────────────────────────────────
  const saveEditing = useCallback(
    async (row: MaterialDetailType) => {
      const isPending = pendingIds.has(row.id);
      try {
        if (isPending) {
          if (!row.ingredient_id) {
            notify("Vui lòng chọn nguyên liệu!", "error");
            return;
          }
          const res = await materialDetailApi.createMateiralDetail({
            material_id,
            ingredient_id: row.ingredient_id,
            weight: row.weight ?? undefined,
            real_percent: row.real_percent ?? undefined,
            note: row.note ?? undefined,
          });
          setPendingIds((prev) => {
            const s = new Set(prev);
            s.delete(row.id);
            return s;
          });
          onSaveSuccess();
        } else {
          // UPDATE
          await materialDetailApi.updateMaterialDetail(row.id, {
            weight: row.weight ?? undefined,
            real_percent: row.real_percent ?? undefined,
            note: row.note ?? undefined,
          });
          setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
        }
        setEditingId(null);
        setOriginalRow(null);
        notify("Lưu thành công!", "success");
      } catch (err) {
        notify("Lỗi khi lưu!", "error");
        console.error(err);
      }
    },
    [material_id, pendingIds, setRows, notify, onSaveSuccess],
  );

  // ── Add new pending row ───────────────────────────────────────────────────
  const handleAddRow = useCallback(() => {
    // nếu đang edit row khác thì cancel trước
    if (editingId !== null) cancelEditing();

    const tempId = -Date.now(); // âm để không trùng id DB
    const newRow: MaterialDetailType = {
      id: tempId,
      material_id,
      ingredient_id: 0,
      ingredient_name: "",
      weight: null,
      real_percent: null,
      note: "",
    };
    setRows((prev) => [newRow, ...prev]);
    setPendingIds((prev) => new Set(prev).add(tempId));
    setEditingId(tempId);
    setOriginalRow({ ...newRow });
  }, [editingId, cancelEditing, material_id, setRows]);

  // ── Field change ──────────────────────────────────────────────────────────
  const handleFieldChange = useCallback(
    (id: number, field: keyof MaterialDetailType, value: unknown) => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          // nếu chọn ingredient → tự điền ingredient_name
          if (field === "ingredient_id") {
            const opt = ingredientOptions.find((o) => o.id === Number(value));
            return {
              ...r,
              ingredient_id: Number(value),
              ingredient_name: opt?.ingredient_name ?? "",
            };
          }
          return { ...r, [field]: value };
        }),
      );
    },
    [ingredientOptions, setRows],
  );

  return {
    editingId,
    pendingIds,
    startEditing,
    cancelEditing,
    saveEditing,
    handleAddRow,
    handleFieldChange,
  };
};

export default useMaterialDetailForm;
