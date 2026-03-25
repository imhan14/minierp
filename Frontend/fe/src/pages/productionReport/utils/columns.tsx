import { Autocomplete, MenuItem, TextField } from "@mui/material";
import {
  productionReportDetailSchema,
  type ProductionReportDetailDisplay,
} from "../../../schema/productReportDetail.schema";
import type { ProductType } from "../../../types/ProductType";

export const productDetailColumns = (
  editingId: number | null | string | undefined,
  productOptions: ProductType[],
  onFieldChange: (
    id: number | string,
    field: string,
    value: string | null,
  ) => void,
) => [
  {
    ...productionReportDetailSchema.product_name,
    render: (_: unknown, row: ProductionReportDetailDisplay) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <Autocomplete
          size="small"
          sx={{ width: 300 }}
          options={productOptions}
          renderInput={(params) => <TextField {...params} label="Product" />}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.product_name
          }
          isOptionEqualToValue={(option, value) => {
            if (!value) return false;
            return option.id === (typeof value === "string" ? value : value.id);
          }}
          onChange={(_, newValue) => {
            if (newValue && typeof newValue !== "string") {
              onFieldChange(row.id, "product_id", newValue.id);
              onFieldChange(row.id, "product_name", newValue.product_name);
            } else {
              onFieldChange(row.id, "product_id", null);
              onFieldChange(row.id, "product_name", newValue || "");
            }
          }}
          value={
            productOptions.find((p) => p.id === row.product_id) ||
            row.product_name
          }
        />
      ) : (
        <span>{row.product_name}</span>
      );
    },
  },
  {
    ...productionReportDetailSchema.is_finish,
    render: (_: unknown, row: ProductionReportDetailDisplay) => {
      const isEditing = editingId === row.id;
      const isFinish = [
        { label: "Đạt", value: "true" },
        { label: "Không đạt", value: "false" },
      ];
      return isEditing ? (
        <TextField
          size="small"
          select
          fullWidth
          disabled={editingId !== row.id}
          value={String(row.is_finish) || ""}
          onChange={(e) => onFieldChange(row.id, "is_finish", e.target.value)}
        >
          {isFinish.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <span>
          {row.is_finish === true
            ? "Đạt"
            : row.is_finish === false
              ? "Không đạt"
              : "-"}
        </span>
      );
    },
  },
  {
    ...productionReportDetailSchema.weight,
    render: (_: unknown, row: ProductionReportDetailDisplay) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <TextField
          size="small"
          fullWidth
          value={row.weight || ""}
          onChange={(e) => onFieldChange(row.id, "weight", e.target.value)}
        />
      ) : (
        <span>{row.weight}</span>
      );
    },
  },
  {
    id: "actions",
    label: "Actions",
  },
];
