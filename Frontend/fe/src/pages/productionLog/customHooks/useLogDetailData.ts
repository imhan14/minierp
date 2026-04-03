import { useCallback, useEffect, useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import productionLogDetailApi from "../../../apis/productionLogDetailApi";
import type { ProductionLogDetailType } from "../../../types/ProductionLogDetailType";

export const useLogDetailData = (
  log_id: number | null,
  setLogDetail: React.Dispatch<React.SetStateAction<ProductionLogDetailType[]>>,
) => {
  const notify = useNotify();
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchLogDetailData = useCallback(async () => {
    if (!log_id) return;
    try {
      setDetailLoading(true);
      const detail = await productionLogDetailApi.getAllProductionLogDetails({
        production_log_id: log_id,
      });
      setError(null);
      setLogDetail(detail.data);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      notify("Không thể tải dữ liệu", "error");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }, [log_id, notify, setLogDetail]);

  useEffect(() => {
    fetchLogDetailData();
  }, [log_id]);

  return { fetchLogDetailData, error, detailLoading };
};
