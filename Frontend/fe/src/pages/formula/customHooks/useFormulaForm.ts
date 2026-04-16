import formulaApi from "@/apis/formulaApi";
import { useNotify } from "@/hooks/useNotify";
import type { FormulaType } from "@/types/FormulaType";
import { useState } from "react";

export const useFormulaForm = (
  onSuccess: (newFormula: FormulaType) => void,
) => {
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAddNewReport = async () => {
    try {
      setIsSubmitting(true);
      const response = await formulaApi.createFormula({});
      notify("Add Successful!", "success");
      onSuccess(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return { isSubmitting, handleAddNewReport };
};
