import type { Dayjs } from "dayjs";
import materialReportApi from "../../../apis/materialReportApi";
import { useState } from "react";
import { useNotify } from "../../../hooks/useNotify";

const useMaterialReportForm = (
  selectedDate: Dayjs | null,
  onSuccess: () => void,
) => {
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAddNewReport = async () => {
    try {
      setIsSubmitting(true);
      const dateParam = selectedDate?.isValid()
        ? selectedDate.format("YYYY-MM-DD")
        : "";
      const payload = {
        team_id: 1,
        report_date: dateParam,
      };
      await materialReportApi.createMaterialReport(payload);
      onSuccess();
      notify("Add Successful!", "success");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    handleAddNewReport,
    isSubmitting,
  };
};
export default useMaterialReportForm;
