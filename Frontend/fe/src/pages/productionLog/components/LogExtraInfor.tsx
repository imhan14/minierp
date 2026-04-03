import { Box, Grid, TextField, Typography } from "@mui/material";
import type { ProductionLogDetailType } from "../../../types/ProductionLogDetailType";

interface LogExtraInfoProps {
  row: ProductionLogDetailType;
  isEditing: boolean;
  onChange: (id: number | string, field: string, value: string) => void;
}

const LogExtraInfor = ({ row, isEditing, onChange }: LogExtraInfoProps) => {
  const textFields = [
    {
      label: "Package Received",
      key: "pkg_received",
      type: "text",
    },
    {
      label: "Package Returned",
      key: "pkg_returned",
      type: "text",
    },
    {
      label: "Package Damaged",
      key: "pkg_damaged",
      type: "text",
    },
  ];
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
        {textFields.map((field) => (
          <Grid size={4} key={field.key}>
            {field.type === "text" && (
              <TextField
                label={field.label}
                fullWidth
                size="small"
                disabled={!isEditing}
                value={row[field.key as keyof ProductionLogDetailType] || ""}
                onChange={(e) => onChange(row.id, field.key, e.target.value)}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LogExtraInfor;
