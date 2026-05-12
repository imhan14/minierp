import { useState, useEffect, useCallback, useRef } from "react";
import { useNotify } from "./useNotify";

export function useEntity<T, R = T, F = Record<string, unknown>>(
  apiCall: (filters?: F) => Promise<{ data: R[] }>,
  options: {
    immediate?: boolean;
    initialFilters?: F;
    formatter?: (data: R[]) => T[];
  } = {},
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const currentFilters = useRef<F | undefined>(options.initialFilters);
  const { immediate = true, formatter } = options;
  const notify = useNotify();

  const execute = useCallback(
    async (newFilters?: F) => {
      setLoading(true);
      if (newFilters !== undefined) {
        currentFilters.current = newFilters;
      }
      try {
        const response = await apiCall(currentFilters.current);
        const processedData = formatter
          ? formatter(response.data)
          : (response.data as unknown as T[]);
        setData(processedData);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi tải dữ liệu";
        notify(errorMessage || "Lỗi tải dữ liệu", "error");
      } finally {
        setLoading(false);
      }
    },
    [apiCall, formatter, notify],
  );

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, loading, reload: execute, setData };
}
