import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import type { FieldConfig } from "../types/FieldConfig";
interface GeneralInfoSectionProps<T> {
  title: string;
  displayFields: FieldConfig<T>[];
  data: T | null;
  disableList?: Record<string, boolean>;
  onGeneralChange?: (id: keyof T, value: string) => void;
  onSave: () => Promise<void> | void;
  onCancel?: () => void;
}

const GeneralInfoSection = <T,>({
  title,
  displayFields,
  data,
  onGeneralChange,
  onSave,
  onCancel,
}: GeneralInfoSectionProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!data) return <Typography>Không có dữ liệu.</Typography>;
  const handleSaveClick = async () => {
    setLoading(true);
    await onSave();
    setLoading(false);
    setIsEditing(false);
  };
  const handleCancelClick = () => {
    if (onCancel) onCancel();
    setIsEditing(false);
  };
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          {title}
        </Typography>

        <Box>
          {!isEditing ? (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                size="small"
                color="success"
                onClick={handleSaveClick}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button
                startIcon={<CloseIcon />}
                variant="outlined"
                size="small"
                color="error"
                onClick={handleCancelClick}
                disabled={loading}
              >
                Hủy
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {displayFields.map((col) => {
          const isFieldEditing = isEditing && !col.isReadOnly;
          const rawValue = data[col.id as keyof T] ?? "";
          const currentGridSize = col.gridSize || { xs: 12, sm: 6, md: 3 };
          return (
            <Grid size={currentGridSize} key={col.id.toString()}>
              {isFieldEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  label={col.label}
                  type={
                    col.inputType === "datetime-local"
                      ? "datetime-local"
                      : "text"
                  }
                  select={col.inputType === "select"}
                  value={rawValue}
                  onChange={(e) =>
                    onGeneralChange?.(col.id as keyof T, e.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ ...col.sx }}
                >
                  {col.inputType === "select" &&
                    col.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  label={col.label}
                  variant="standard"
                  disabled
                  value={
                    (!isEditing || col.isReadOnly) && col.render
                      ? col.render(data[col.id as keyof T], data)
                      : (data[col.id as keyof T] ?? "")
                  }
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#334155",
                    },
                    bgcolor: "#f8fafc",
                    ...col.sx,
                  }}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GeneralInfoSection;
