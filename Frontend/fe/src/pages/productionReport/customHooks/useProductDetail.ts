import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNotify } from "@/hooks/useNotify";
import productionReportDetailApi from "@/apis/productionReportDetailApi";
import productionApi from "@/apis/productionApi";
import type { ProductType } from "@/types/ProductType";
import type { ProductionReportDetailDisplay } from "@/types/ProductReportDetailType";

export const useProductDetail = (
  report_id: number | null,
  onSaveSuccess: () => void,
) => {
  const [editProducts, setEditProducts] = useState<
    ProductionReportDetailDisplay[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [productOptions, setProductOptions] = useState<ProductType[]>([]);
  const [originalData, setOriginalData] =
    useState<ProductionReportDetailDisplay | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const notify = useNotify();

  const isDirty = () => {
    if (!editingId) return false;
    const currentData = editProducts.find((p) => p.id === editingId);
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
  const getAllProductionReportDetail = async (report_id: number | null) => {
    const detail = await productionReportDetailApi.getAllProductionReportDetail(
      {
        report_id,
      },
    );
    const formattedData: ProductionReportDetailDisplay[] = detail.data.map(
      (item) => {
        const { products, ...rest } = item;
        return {
          ...rest,
          product_id: products?.id,
          product_name: products?.product_name || "N/A",
        };
      },
    );
    return formattedData;
  };

  const fetchProductDetailData = useCallback(async () => {
    if (!report_id) return;
    try {
      const [detail, options] = await Promise.all([
        getAllProductionReportDetail(report_id),
        productionApi.getAllProducts(),
      ]);
      setEditProducts(detail);
      setProductOptions(options.data);
    } catch (err) {
      notify("Không thể tải dữ liệu", "error");
      console.error(err);
    }
  }, [report_id, notify]);
  useEffect(() => {
    fetchProductDetailData();
  }, [fetchProductDetailData]);

  const startEditing = (row: ProductionReportDetailDisplay) => {
    guardAction(() => {
      setEditingId(row.id);
      setOriginalData({ ...row });
    });
  };

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

  const getProductList = async () => {
    try {
      setDetailLoading(true);
      setEditProducts(await getAllProductionReportDetail(report_id));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };
  return {
    showConfirmDialog,
    setShowConfirmDialog,
    handleDiscardChanges,
    handleSaveAndContinue,
    guardAction,
    cancelEditing,
    startEditing,
    detailLoading,
    error,
    editProducts,
    setEditProducts,
    editingId,
    setEditingId,
    productOptions,
    handleDetailChange,
    saveEditing,
    handleDeleteRow: deleteRowWithGuard,
    getProductList,
  };
};
