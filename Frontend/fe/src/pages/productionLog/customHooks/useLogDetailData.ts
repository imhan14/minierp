import { useCallback, useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import productionLogDetailApi from "../../../apis/productionLogDetailApi";
import type { ProductReportDetailType } from "../../../types/ProductReportDetailType";

export const useLogDetailData = (log_id: number | null) => {
  const notify = useNotify();
  const [logDetail, setLogDetail] = useState<ProductReportDetailType[]>([]);
  const [deTailLoading, setDetailLoading] = useState(false);
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
  }, [log_id, notify]);

  return { fetchLogDetailData, logDetail, error, deTailLoading };
};
