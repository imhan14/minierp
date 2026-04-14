import { Autocomplete, TextField } from "@mui/material";
import { logDetailSchema } from "@/schema/productionLogDetail.schema";
import type { ProductionLogDetailType } from "@/types/ProductionLogDetailType";
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
    gridSize: { md: 1 },
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <DateTimePicker
          label={"Start Time"}
          sx={{ width: 200 }}
          value={row.start_time ? dayjs(row.start_time) : null}
          disabled={!isEditing}
          format="DD/MM/YYYY HH:mm"
          onChange={(val) =>
            onFieldChange(row.id, "start_time", val ? val.toISOString() : "")
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
        <span>
          {row.start_time ? dayjs(row.start_time).format("DD/MM HH:mm") : "-"}
        </span>
      );
    },
  },
  {
    ...logDetailSchema.end_time,
    render: (_: unknown, row: ProductionLogDetailType) => {
      const isEditing = editingId === row.id;
      return isEditing ? (
        <DateTimePicker
          sx={{ width: 200 }}
          label={"End Time"}
          value={row.end_time ? dayjs(row.end_time) : null}
          disabled={!isEditing}
          format="DD/MM/YYYY HH:mm"
          onChange={(val) =>
            onFieldChange(row.id, "end_time", val ? val.toISOString() : "")
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
        <span>
          {row.end_time ? dayjs(row.end_time).format("DD/MM HH:mm") : "-"}
        </span>
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
          freeSolo
          size="small"
          sx={{ width: 140 }}
          options={taskType}
          renderInput={(params) => <TextField {...params} label="Task Type" />}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          isOptionEqualToValue={(option, value) => {
            if (!value) return false;
            const compareValue =
              typeof value === "string" ? value : value.value;
            return option.value === compareValue;
          }}
          onChange={(_, newValue) => {
            const val =
              typeof newValue === "string" ? newValue : newValue?.value || null;
            onFieldChange(row.id, "task_type", val);
          }}
          value={
            taskType.find((p) => p.value === row.task_type) ||
            row.task_type ||
            null
          }
        />
      ) : (
        <span>
          {taskType.find((t) => t.value === row.task_type)?.label ||
            row.task_type ||
            "-"}
        </span>
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
          sx={{ width: 200 }}
          size="small"
          fullWidth
          value={row.content || ""}
          onChange={(e) => onFieldChange(row.id, "content", e.target.value)}
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
          type="number"
          slotProps={{
            htmlInput: {
              step: "any",
              sx: {
                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                  display: "none",
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "&[type=number]": {
                  MozAppearance: "textfield",
                },
              },
            },
          }}
          sx={{ width: 80 }}
          size="small"
          fullWidth
          value={row.quantity || ""}
          onChange={(e) => onFieldChange(row.id, "quantity", e.target.value)}
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
          freeSolo
          size="small"
          sx={{ width: 140 }}
          options={productType}
          renderInput={(params) => (
            <TextField {...params} label="Product Type" />
          )}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          isOptionEqualToValue={(option, value) => {
            if (!value) return false;
            const compareValue =
              typeof value === "string" ? value : value.value;
            return option.value === compareValue;
          }}
          onChange={(_, newValue) => {
            const val =
              typeof newValue === "string" ? newValue : newValue?.value || null;
            onFieldChange(row.id, "product_type", val);
          }}
          value={
            productType.find((p) => p.value === row.product_type) ||
            row.product_type ||
            null
          }
        />
      ) : (
        <span>
          {productType.find((p) => p.value === row.product_type)?.label ||
            row.product_type ||
            "-"}
        </span>
      );
    },
  },

  {
    id: "actions",
    label: "Actions",
  },
];
