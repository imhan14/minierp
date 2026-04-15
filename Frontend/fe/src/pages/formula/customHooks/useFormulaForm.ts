import formulaApi from "@/apis/formulaApi";
import { useNotify } from "@/hooks/useNotify";
import { useState } from "react";

export const useFormulaForm = (onSuccess: () => void) => {
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAddNewReport = async () => {
    try {
      setIsSubmitting(true);

      await formulaApi.createFormula({});
      onSuccess();
      notify("Add Successful!", "success");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return { isSubmitting, handleAddNewReport };
};
