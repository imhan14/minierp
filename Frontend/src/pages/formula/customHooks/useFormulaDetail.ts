import { useState, useEffect, useCallback } from "react";
import {
  CreateFormulaDetailSchema,
  UpdateFormulaDetailSchema,
  type FormulaDetailType,
} from "@/schema/formulaDetail.schema";
import formulaDetailApi from "@/apis/formulaDetailApi";
import ingredientApi from "@/apis/ingredientApi";
import type { IngredientType } from "@/schema/ingredient.schema";
import { useNotify } from "@/hooks/useNotify";

export type EditingRow = FormulaDetailType & { _isNew?: boolean };

const EMPTY_ROW = (formula_id: number): EditingRow => ({
  id: undefined,
  formula_id,
  ingredient_id: undefined,
  ingredient_name: "",
  unit: undefined,
  standard_quality: undefined,
  _isNew: true,
});

export const useFormulaDetail = (
  formula_id: number | null,
  onSaveSuccess: () => void,
) => {
  const notify = useNotify();
  const [rows, setRows] = useState<FormulaDetailType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [editingData, setEditingData] = useState<EditingRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [ingredientOptions, setIngredientOptions] = useState<IngredientType[]>(
    [],
  );

  useEffect(() => {
    ingredientApi
      .getAllIngredients()
      .then((res) => setIngredientOptions(res.data))
      .catch(console.error);
  }, []);

  const fetchDetails = useCallback(async () => {
    if (!formula_id) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const res = await formulaDetailApi.getAllFormulaDetails({ formula_id });
      setRows(
        res.data.map((item: FormulaDetailType) => ({
          ...item,
          ingredient_id: item.ingredients?.id ?? item.ingredient_id,
          ingredient_name:
            item.ingredients?.ingredient_name ?? item.ingredient_name,
          unit: item.ingredients?.unit ?? item.unit,
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formula_id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const setField = (field: keyof EditingRow, value: unknown) => {
    setEditingData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAddNewRow = () => {
    if (!formula_id) return;
    if (editingId !== undefined) {
      notify("Vui lòng lưu hoặc hủy dòng đang chỉnh sửa trước", "warning");
      return;
    }
    const newRow = EMPTY_ROW(formula_id);
    const tempId = -Date.now();
    const rowWithTempId = { ...newRow, id: tempId as unknown as number };
    setRows((prev) => [rowWithTempId, ...prev]);
    setEditingId(tempId as unknown as number);
    setEditingData(rowWithTempId);
  };

  const cancelEditing = () => {
    if (editingData?._isNew) {
      setRows((prev) => prev.filter((r) => r.id !== editingId));
    }
    setEditingId(undefined);
    setEditingData(null);
  };

  const saveEditing = async () => {
    if (!editingData) return;
    const isNew = editingData._isNew;

    const schema = isNew
      ? CreateFormulaDetailSchema
      : UpdateFormulaDetailSchema;
    const dataToParse = isNew ? { ...editingData, formula_id } : editingData;
    const parsed = schema.safeParse(dataToParse);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ";
      notify(msg, "error");
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        await formulaDetailApi.createFormulaDetail(parsed.data);
        notify("Thêm nguyên liệu thành công!", "success");
      } else {
        await formulaDetailApi.updateFormulaDetail(
          editingData.id!,
          parsed.data,
        );
        notify("Cập nhật thành công!", "success");
      }
      setEditingId(undefined);
      setEditingData(null);
      fetchDetails();
      onSaveSuccess();
    } catch (err) {
      notify(
        isNew ? "Lỗi khi thêm nguyên liệu!" : "Lỗi khi cập nhật!",
        "error",
      );
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (row: FormulaDetailType) => {
    if (!window.confirm(`Xóa nguyên liệu "${row.ingredient_name}"?`)) return;
    try {
      await formulaDetailApi.deleteFormulaDetail(row.id!);
      notify("Xóa thành công!", "success");
      fetchDetails();
      onSaveSuccess();
    } catch (err) {
      notify("Lỗi khi xóa!", "error");
      console.error(err);
    }
  };

  const startEditing = (row: FormulaDetailType) => {
    setEditingId(row.id);
    setEditingData({ ...row });
  };

  return {
    rows,
    loading,
    editingId,
    editingData,
    isSaving,
    ingredientOptions,
    setField,
    handleAddNewRow,
    cancelEditing,
    saveEditing,
    handleDelete,
    startEditing,
  };
};
