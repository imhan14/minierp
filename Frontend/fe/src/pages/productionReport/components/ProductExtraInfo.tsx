import { Box, Grid, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import type { ProductionReportDetailDisplay } from "../../../schema/productReportDetail.schema";

interface ProductExtraInfoProps {
  row: ProductionReportDetailDisplay;
  isEditing: boolean;
  onChange: (id: number | string, field: string, value: string) => void;
}

export const ProductExtraInfo = ({
  row,
  isEditing,
  onChange,
}: ProductExtraInfoProps) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#fafafa",
        borderRadius: 1,
        border: "1px solid #eee",
      }}
    >
      <Typography variant="subtitle2" gutterBottom color="primary">
        Thông tin chi tiết sản phẩm
      </Typography>
      <Grid container spacing={2}>
        <Grid size={4}>
          <TextField
            label="Type of specification"
            fullWidth
            size="small"
            type="text"
            disabled={!isEditing}
            value={row.type_of_specification || 0}
            onChange={(e) =>
              onChange(row.id, "type_of_specification", e.target.value)
            }
          />
        </Grid>
        <Grid size={4}>
          <TextField
            label="Product Line"
            fullWidth
            size="small"
            disabled={!isEditing}
            value={row.product_line || 0}
            onChange={(e) => onChange(row.id, "product_line", e.target.value)}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            label="Specification"
            fullWidth
            size="small"
            disabled={!isEditing}
            value={row.specification || 0}
            onChange={(e) => onChange(row.id, "specification", e.target.value)}
          />
        </Grid>
        <Grid size={4}>
          <DateTimePicker
            label="Start Time"
            value={row.start_time ? dayjs(row.start_time as string) : null}
            disabled={!isEditing}
            onChange={(newValue) => {
              onChange?.(
                row.id,
                "start_time",
                newValue ? newValue.toISOString() : "",
              );
            }}
            format="DD/MM/YYYY HH:mm"
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                placeholder: "dd/mm/yyyy --:--",
              },
            }}
          />
        </Grid>
        <Grid size={4}>
          <DateTimePicker
            label="End Time"
            value={row.end_time ? dayjs(row.end_time as string) : null}
            disabled={!isEditing}
            onChange={(newValue) => {
              onChange?.(
                row.id,
                "end_time",
                newValue ? newValue.toISOString() : "",
              );
            }}
            format="DD/MM/YYYY HH:mm"
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                placeholder: "dd/mm/yyyy --:--",
              },
            }}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            label="Ghi chú chính"
            fullWidth
            size="small"
            disabled={!isEditing}
            value={row.note || ""}
            onChange={(e) => onChange(row.id, "note", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
