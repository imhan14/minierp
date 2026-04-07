import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export const ConfirmActionDialog = ({
  open,
  title,
  content,
  onConfirm,
  onClose,
  color = "primary",
}: any) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{content}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        Bỏ qua
      </Button>
      <Button onClick={onConfirm} variant="contained" color={color}>
        Xác nhận
      </Button>
    </DialogActions>
  </Dialog>
);
