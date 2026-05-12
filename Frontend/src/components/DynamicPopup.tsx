import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DynamicPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  mode?: "view" | "add" | "edit";
  onSubmit?: () => void;
  isSubmitting?: boolean;
  footer?: React.ReactNode;
}
const SUBMIT_CONFIG = {
  add: {
    label: "Thêm mới",
    loadingLabel: "Đang thêm...",
    color: "primary" as const,
  },
  edit: {
    label: "Lưu thay đổi",
    loadingLabel: "Đang lưu...",
    color: "success" as const,
  },
};
const DynamicPopup = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
  mode,
  onSubmit,
  isSubmitting = false,
  footer,
}: DynamicPopupProps) => {
  const submitCfg = mode && mode !== "view" ? SUBMIT_CONFIG[mode] : null;
  const defaultFooter = (
    <Box sx={{ display: "flex", gap: 1 }}>
      {submitCfg && (
        <Button
          onClick={onSubmit}
          variant="contained"
          color={submitCfg.color}
          disabled={isSubmitting}
        >
          {isSubmitting ? submitCfg.loadingLabel : submitCfg.label}
        </Button>
      )}

      <Button
        onClick={onClose}
        color="inherit"
        variant="outlined"
        disabled={isSubmitting}
      >
        {mode === "view" ? "Đóng" : "Hủy"}
      </Button>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          bgcolor: "#f8fafc",
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3, bgcolor: "#ffffff" }}>
        {children}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: "#f8fafc" }}>
        {footer ?? defaultFooter}
      </DialogActions>
    </Dialog>
  );
};

export default DynamicPopup;
