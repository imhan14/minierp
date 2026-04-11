import type { Dayjs } from "dayjs";
import { useNotify } from "../../../hooks/useNotify";
import { useState } from "react";
import productOrderApi from "../../../apis/productOrderApi";

export const useOrderForm = (
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
        order_date: dateParam,
      };
      await productOrderApi.createOrder(payload);
      onSuccess();
      notify("Add successfull!", "success");
    } catch (err) {
      console.error(err);
      notify("Add failed!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return { isSubmitting, handleAddNewReport };
};
