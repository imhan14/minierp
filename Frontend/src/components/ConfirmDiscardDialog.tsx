import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export const ConfirmDiscardDialog = ({
  open,
  onSave,
  onDiscard,
  onClose,
}: any) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Thay đổi chưa được lưu</DialogTitle>
    <DialogContent>
      <Typography>
        Bạn có thay đổi chưa lưu trên dòng này. Bạn muốn làm gì?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        Tiếp tục chỉnh sửa
      </Button>
      <Button onClick={onDiscard} color="error">
        Hủy thay đổi
      </Button>
      <Button onClick={onSave} variant="contained" color="primary">
        Lưu và tiếp tục
      </Button>
    </DialogActions>
  </Dialog>
);
