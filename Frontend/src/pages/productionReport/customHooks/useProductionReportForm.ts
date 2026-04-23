import type { Dayjs } from "dayjs";
import { useState } from "react";
import productionReportApi from "@/apis/productionReportApi";
import { useNotify } from "@/hooks/useNotify";

export const useProductionReportForm = (
  selectedDate: Dayjs | null,
  onSuccess: () => void,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notify = useNotify();
  const handleAddNewReport = async () => {
    try {
      setIsSubmitting(true);
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser.role > 7) {
        notify("Your role are not allowed", "warning");
        return;
      }
      const dateParam = selectedDate?.isValid()
        ? selectedDate.format("YYYY-MM-DD")
        : "";
      const payload = {
        team_id: currentUser?.team_id,
        report_date: dateParam,
      };
      await productionReportApi.addProductionReport(payload);
      onSuccess();
      notify("Add Successfull!", "success");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return { isSubmitting, handleAddNewReport };
};
