import { Autocomplete, TextField } from "@mui/material";

import { logDetailSchema } from "../../../schema/productionLogDetail.schema";
import type { ProductionLogDetailType } from "../../../types/ProductionLogDetailType";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

export const productLogDetailColumns = (
  editingId: number | null | string | undefined,
  onFieldChange: (
    id: number | string,
    field: string,
    value: string | null,
  ) => void,
) => [
  {
    ...logDetailSchema.start_time,
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <DateTimePicker
          // label={row.label}
          value={row.start_time ? dayjs(row.start_time) : null}
          disabled={!isEditing}
          format="DD/MM/YYYY HH:mm"
          onChange={(val) =>
            onFieldChange(row.id, row.start_time, val ? val.toISOString() : "")
          }
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              placeholder: "dd/mm/yyyy --:--",
            },
          }}
        />
      ) : (
        <span>{row.start_time}</span>
      );
    },
  },
  {
    ...logDetailSchema.end_time,
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <DateTimePicker
          // label={row.label}
          value={row.start_time ? dayjs(row.end_time) : null}
          disabled={!isEditing}
          format="DD/MM/YYYY HH:mm"
          onChange={(val) =>
            onFieldChange(row.id, row.end_time, val ? val.toISOString() : "")
          }
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              placeholder: "dd/mm/yyyy --:--",
            },
          }}
        />
      ) : (
        <span>{row.end_time}</span>
      );
    },
  },
  {
    ...logDetailSchema.task_type,
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      const taskType = [
        { label: "Hygiene", value: "hygiene" },
        { label: "Production", value: "production" },
        { label: "Incident", value: "incident" },
        { label: "Other", value: "other" },
      ];
      return isEditing ? (
        <Autocomplete
          size="small"
          sx={{ width: 300 }}
          options={taskType}
          renderInput={(params) => <TextField {...params} label="Task Type" />}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          isOptionEqualToValue={(option, value) => {
            if (!value) return false;
            return (
              option.value === (typeof value === "string" ? value : value.value)
            );
          }}
          onChange={(_, newValue) => {
            if (newValue && typeof newValue !== "string") {
              onFieldChange(row.id, "value", newValue.value);
              onFieldChange(row.id, "label", newValue.label);
            } else {
              onFieldChange(row.id, "value", null);
              onFieldChange(row.id, "label", newValue || "");
            }
          }}
          value={taskType.find(
            (p) => p.value === row.task_type || row.task_type,
          )}
        />
      ) : (
        <span>{row.task_type}</span>
      );
    },
  },
  {
    ...logDetailSchema.content,
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <TextField
          type="text"
          size="small"
          fullWidth
          value={row.content || ""}
          onChange={(e) => onFieldChange(row.id, "weight", e.target.value)}
        />
      ) : (
        <span>{row.content}</span>
      );
    },
  },
  {
    ...logDetailSchema.quantity,
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <TextField
          type="text"
          size="small"
          fullWidth
          value={row.quantity || ""}
          onChange={(e) => onFieldChange(row.id, "weight", e.target.value)}
        />
      ) : (
        <span>{row.quantity}</span>
      );
    },
  },
  {
    ...logDetailSchema.product_type,
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      const productType = [
        { label: "Sang bao", value: "sb" },
        { label: "Mùa khô", value: "mk" },
        { label: "1 hạt", value: "mh" },
        { label: "Nhỏ giọt", value: "ng" },
        { label: "Trộn", value: "tr" },
      ];
      return isEditing ? (
        <Autocomplete
          size="small"
          sx={{ width: 300 }}
          options={productType}
          renderInput={(params) => (
            <TextField {...params} label="Product Type" />
          )}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          isOptionEqualToValue={(option, value) => {
            if (!value) return false;
            return (
              option.value === (typeof value === "string" ? value : value.value)
            );
          }}
          onChange={(_, newValue) => {
            if (newValue && typeof newValue !== "string") {
              onFieldChange(row.id, "value", newValue.value);
              onFieldChange(row.id, "label", newValue.label);
            } else {
              onFieldChange(row.id, "value", null);
              onFieldChange(row.id, "label", newValue || "");
            }
          }}
          value={productType.find(
            (p) => p.value === row.product_type || row.product_type,
          )}
        />
      ) : (
        <span>{row.product_type}</span>
      );
    },
  },

  {
    id: "actions",
    label: "Actions",
  },
];
