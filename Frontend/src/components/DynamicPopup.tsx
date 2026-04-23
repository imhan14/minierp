import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  //   Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DynamicPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  enableSend?: boolean;
}

const DynamicPopup = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  footer,
  maxWidth = "md",
  enableSend = false,
}: DynamicPopupProps) => {
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
        {footer || (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={onSubmit}
              variant="contained"
              sx={{ display: enableSend ? "block" : "none" }}
            >
              Gửi
            </Button>
            <Button onClick={onClose} color="inherit" variant="outlined">
              Đóng
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DynamicPopup;
