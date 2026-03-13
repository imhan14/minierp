import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
export interface FieldConfig<T> {
  id: keyof T;
  label: string;
  isReadOnly?: boolean;
}
interface GeneralInfoSectionProps<T> {
  title: string;
  displayFields: FieldConfig<T>[];
  data: T;
  disableList: object;
  onGeneralChange?: (id: keyof T, value: string) => void;
  onSave: () => Promise<void> | void;
  onCancel?: () => void;
  getRowKey: (row: T) => string | number;
}

const GeneralInfoSection = <T,>({
  title,
  displayFields,
  data,
  onGeneralChange,
  onSave,
  onCancel,
  getRowKey,
}: GeneralInfoSectionProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
        {displayFields.map((col) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={col.id.toString()}>
            <TextField
              fullWidth
              label={col.label}
              size="small"
              disabled={col.isReadOnly || !isEditing}
              value={data[col.id] || ""}
              onChange={(e) => onGeneralChange(col.id, e.target.value)}
              variant={isEditing && !col.isReadOnly ? "outlined" : "filled"}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#334155", // Màu chữ đậm hơn khi disabled để dễ đọc
                },
                bgcolor:
                  isEditing && !col.isReadOnly ? "transparent" : "#f8fafc",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GeneralInfoSection;
