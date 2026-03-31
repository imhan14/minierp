import type { Dayjs } from "dayjs";
import productionLogApi from "../../../apis/productionLogApi";
import { useNotify } from "../../../hooks/useNotify";
import { useState } from "react";

export const useProductionLogForm = (
  selectedDate: Dayjs | null,
  onSuccess: () => void,
) => {
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAddNewReport = async () => {
    try {
      setIsSubmitting(true);
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const dateParam = selectedDate?.isValid()
        ? selectedDate.format("YYYY-MM-DD")
        : "";
      const payload = {
        team_id: currentUser?.team_id,
        log_date: dateParam,
      };
      await productionLogApi.createProductionLog(payload);
      onSuccess();
      notify("Add successfull!", "success");
    } catch (err) {
      console.error(err);
      notify("Add failed!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return { handleAddNewReport, isSubmitting };
};
