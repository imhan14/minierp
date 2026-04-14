import { useNotify } from "@/hooks/useNotify";
import { useState } from "react";

export const useFormulaForm = () => {
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  return { isSubmitting };
};
