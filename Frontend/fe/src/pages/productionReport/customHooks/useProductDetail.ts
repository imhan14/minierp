import { useEffect, useState } from "react";
import type { ProductionReportDetailDisplay } from "../../../schema/productReportDetail.schema";
import { getProductionReportDetail } from "../dataProductionReport";
import api from "../../../apis/axios";

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
  const [productOptions, setProductOptions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [originalData, setOriginalData] =
    useState<ProductionReportDetailDisplay | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isDirty = () => {
    if (!editingId) return false;
    const currentData = editProducts.find((p) => p.id === editingId);
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  const guardAction = (action: () => void) => {
    if (isDirty()) {
      setPendingAction(() => action); // Lưu lại hành động định làm
      setShowConfirmDialog(true); // Mở Dialog hỏi người dùng
    } else {
      action(); // Không có thay đổi thì làm luôn
    }
  };

  const fetchData = async () => {
    if (!report_id) return;
    try {
      const [details, products] = await Promise.all([
        getProductionReportDetail(report_id),
        api.get("/product").then((res) => res.data),
      ]);
      setEditProducts(details);
      setProductOptions(products);
    } catch (err) {
      showSnackbar("Không thể tải dữ liệu", "error");
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, [report_id]);

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
        await api.delete(`/product-report-detail/${row.id}`);
        setEditProducts((prev) => prev.filter((item) => item.id !== row.id));
        showSnackbar("Xóa thành công!", "success");
        onSaveSuccess();
      } catch (error) {
        showSnackbar("Lỗi khi xóa!", "error");
        console.error(error);
      }
    });
  };

  const showSnackbar = (message: string, severity: "success" | "error") =>
    setSnackbar({ open: true, message, severity });

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
      const payload = {
        product_id: Number(row.product_id) || undefined,
        report_id: report_id || undefined,
        is_finish: String(row.is_finish) === "true" || undefined,
        type_of_specification: row.type_of_specification || undefined,
        product_line: row.product_line || undefined,
        specification: row.specification || undefined,
        start_time: row.start_time || undefined,
        end_time: row.end_time || undefined,
        weight: Number(row.weight) || undefined,
        note: row.note || undefined,
      };
      if (row.isNew) await api.post("/product-report-detail", payload);
      else await api.patch(`/product-report-detail/${row.id}`, payload);

      setEditingId(null);
      showSnackbar("Cập nhật thành công!", "success");
      onSaveSuccess();
    } catch (error) {
      showSnackbar("Lỗi khi lưu dữ liệu!", "error");
      console.error(error);
    }
  };

  const getProductList = async () => {
    try {
      setDetailLoading(true);
      setEditProducts(await getProductionReportDetail(report_id));
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };
  // const handleDeleteRow = async (row: ProductionReportDetailDisplay) => {
  //   if (!window.confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) return;
  //   try {
  //     const updatedList = editProducts.filter((item) => item.id !== row.id);
  //     await api.delete(`/product-report-detail/${row.id}`);
  //     setEditProducts(updatedList);
  //     setSnackbar({
  //       open: true,
  //       message: "Xóa thành công!",
  //       severity: "success",
  //     });
  //     onSaveSuccess();
  //   } catch (error) {
  //     setSnackbar({ open: true, message: "Lỗi khi xóa!", severity: "error" });
  //     console.error(error);
  //   }
  // };
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
    snackbar,
    setSnackbar,
    handleDetailChange,
    saveEditing,
    handleDeleteRow: deleteRowWithGuard,
    getProductList,
  };
};
