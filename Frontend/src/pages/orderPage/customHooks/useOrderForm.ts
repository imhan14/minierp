import { useNotify } from "@/hooks/useNotify";
import { useState } from "react";
import productOrderApi, { type OrderData } from "@/apis/productOrderApi";

export const useOrderForm = (
  onSuccess: () => void,
) => {
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCreateOrder = async (data: OrderData) => {
    try {
      setIsSubmitting(true);
      await productOrderApi.createOrder(data);
      onSuccess();
      notify("Tạo lệnh thành công.", "success");
      return true;
    } catch (err) {
      console.error(err);
      notify("Không thể tạo lệnh.", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  return { isSubmitting, handleCreateOrder };
};
