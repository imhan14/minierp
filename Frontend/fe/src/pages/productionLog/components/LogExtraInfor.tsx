import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import type { ProductionLogDetailType } from "../../../types/ProductionLogDetailType";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

interface LogExtraInfoProps {
  row: ProductionLogDetailType;
  isEditing: boolean;
  onChange: (id: number | string, field: string, value: string) => void;
}

const LogExtraInfor = ({ row, isEditing, onChange }: LogExtraInfoProps) => {
  const typeOfSpecOptions = ["25Kg", "50Kg"];
  const productLineOptions = ["Trộn", "1 hạt", "Sang bao"];
  const specificationOptions = ["Đen", "Thành phẩm"];

  const textFields = [
    {
      label: "Type of specification",
      key: "type_of_specification",
      type: "select",
    },
    { label: "Product Line", key: "product_line", type: "select" },
    { label: "Specification", key: "specification", type: "select" },
    { label: "Start Time", key: "start_time", type: "date" },
    { label: "End Time", key: "end_time", type: "date" },
    { label: "Ghi chú chính", key: "note", type: "text" },
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
            {field.type === "select" && (
              <Autocomplete
                freeSolo
                fullWidth
                size="small"
                disabled={!isEditing}
                options={
                  (field.key === "type_of_specification" &&
                    typeOfSpecOptions) ||
                  (field.key === "product_line" && productLineOptions) ||
                  (field.key === "specification" && specificationOptions) ||
                  []
                }
                value={
                  (row[field.key as keyof ProductionLogDetailType] as string) ||
                  ""
                }
                onInputChange={(_, newValue) => {
                  onChange(row.id, field.key, newValue);
                }}
                onChange={(_, newValue) => {
                  onChange(row.id, field.key, newValue || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label={field.label} />
                )}
              />
            )}
            {field.type === "date" && (
              <DateTimePicker
                label={field.label}
                value={
                  row[field.key as keyof ProductionLogDetailType]
                    ? dayjs(
                        row[
                          field.key as keyof ProductionLogDetailType
                        ] as string,
                      )
                    : null
                }
                disabled={!isEditing}
                format="DD/MM/YYYY HH:mm"
                onChange={(val) =>
                  onChange(row.id, field.key, val ? val.toISOString() : "")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: "dd/mm/yyyy --:--",
                  },
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LogExtraInfor;
