import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import type { FieldConfig } from "../types/FieldConfig";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "dayjs/locale/vi";
import dayjs from "dayjs";
interface GeneralInfoSectionProps<T> {
  title: string;
  displayFields: FieldConfig<T>[];
  data: T | null;
  disableList?: Record<string, boolean>;
  onGeneralChange?: (id: keyof T, value: string) => void;
  onSave: () => Promise<void> | void;
  onCancel?: () => void;
  showEditButton?: boolean;
}

const GeneralInfoSection = <T,>({
  title,
  displayFields,
  data,
  onGeneralChange,
  onSave,
  onCancel,
  showEditButton = true,
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
            showEditButton && (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </Button>
            )
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
                col.inputType === "datetime-local" ? (
                  <DateTimePicker
                    label={col.label}
                    value={rawValue ? dayjs(rawValue as string) : null}
                    onChange={(newValue) => {
                      onGeneralChange?.(
                        col.id as keyof T,
                        newValue ? newValue.toISOString() : "",
                      );
                    }}
                    format="DD/MM/YYYY HH:mm"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        placeholder: "dd/mm/yyyy --:--",
                        sx: { ...col.sx },
                      },
                    }}
                  />
                ) : col.inputType === "autocomplete" ? (
                  <Autocomplete
                    options={col.optionsAutoComplete || []}
                    getOptionLabel={
                      col.getOptionLabel ||
                      ((option) =>
                        typeof option === "string" ? option : option.label)
                    }
                    isOptionEqualToValue={(option, value) => {
                      if (!value) return false;
                      return (
                        option.value ===
                        (typeof value === "object" ? value : value.value)
                      );
                    }}
                    value={
                      col.optionsAutoComplete?.find(
                        (opt) => String(opt.value) === String(rawValue),
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      const savedValue = newValue ? String(newValue.value) : "";
                      onGeneralChange?.(col.id as keyof T, savedValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={col.label}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{ ...col.sx }}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label={col.label}
                    select={col.inputType === "select"}
                    value={rawValue}
                    onChange={(e) => {
                      onGeneralChange?.(col.id as keyof T, e.target.value);
                    }}
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
                )
              ) : (
                <Box
                  sx={{
                    p: 0.2,
                    // bgcolor: "#f8fafc",
                    borderRadius: 1,
                    border: "solid 0.5px #e2e8f0",
                    // borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    ...col.sx,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    fontWeight="bold"
                  >
                    {col.label}
                  </Typography>
                  <Tooltip
                    title={(() => {
                      if (col.inputType === "select") {
                        return (
                          col.options?.find(
                            (opt) => String(opt.value) === String(rawValue),
                          )?.label || rawValue
                        );
                      }
                      if (col.inputType === "autocomplete") {
                        return (
                          col.optionsAutoComplete?.find(
                            (opt) => String(opt.value) === String(rawValue),
                          )?.label || rawValue
                        );
                      }
                      return data[col.id as keyof T]?.toString() || "";
                    })()}
                    arrow
                    placement="top-start"
                    disableInteractive
                  >
                    <Box
                      sx={{
                        whiteSpace: col.noWrap ? "nowrap" : "normal",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        cursor: "default",
                      }}
                    >
                      {col.inputType === "select"
                        ? col.options?.find((opt) => {
                            return String(opt.value) === String(rawValue);
                          })?.label
                        : col.render
                          ? col.render(data[col.id as keyof T], data)
                          : data[col.id as keyof T]?.toString() || "-"}
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GeneralInfoSection;
