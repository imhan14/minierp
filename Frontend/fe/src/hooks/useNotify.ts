import { useContext } from "react";
import SnackbarContext from "./SnackBarContext";

export const useNotify = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useNotify must be used within SnackbarProvider");
  return context.showSnackbar;
};
