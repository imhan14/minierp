import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import productOrderApi, {
  type OrderFilters,
} from "../../../apis/productOrderApi";
import formulaDetailApi from "../../../apis/formulaDetailApi";
import type { OrderDisplay } from "../../../types/ProductOrderType";
import type { FormulaDetailDisplay } from "../../../types/FormulaDetailType";

export const useOrderData = (
  selectedDate: Dayjs | null,
  endDate: Dayjs | null = null,
) => {
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [formula, setFormula] = useState<FormulaDetailDisplay[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (start?: Dayjs | null, endDate?: Dayjs | null) => {
    try {
      setLoading(true);
      const params: OrderFilters = {};
      if (endDate && start) {
        params.startDate = start.format("YYYY-MM-DD");
        params.endDate = endDate.format("YYYY-MM-DD");
      } else if (start) {
        params.date = start.format("YYYY-MM-DD");
      }

      const response = await productOrderApi.getAllOrders(params);
      const formattedData: OrderDisplay[] = response.data.map((item) => {
        const { teams, formulas, ...rest } = item;
        return {
          ...rest,
          formula_id: formulas?.id,
          team_id: teams?.id,
          team_name: teams?.team_name || "-",
          formula_name: formulas?.formula_name || "-",
        };
      });

      setOrders(formattedData);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormulaDetail = async (formulaId: number) => {
    if (!formulaId) return;
    try {
      setDetailLoading(true);
      const response = await formulaDetailApi.getAllFormulaDetails({
        formula_id: formulaId,
      });
      const formattedData: FormulaDetailDisplay[] = response.data.map(
        (item) => {
          const { ingredients, ...rest } = item;
          return {
            ...rest,
            ingredient_name: ingredients?.ingredient_name,
            unit: ingredients?.unit,
          };
        },
      );

      setFormula(formattedData);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!");
      console.error("API Error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDate, endDate);
  }, [selectedDate, endDate]);
  return {
    orders,
    detailLoading,
    error,
    loading,
    formula,
    fetchFormulaDetail,
    fetchOrders,
    setFormula,
  };
};
