import type { FieldConfig } from "../types/FieldConfig";
import type { ProductionLogDetailType } from "../types/ProductionLogDetailType";

export const logDetailSchema: Record<
  string,
  FieldConfig<ProductionLogDetailType>
> = {
  id: { id: "id", label: "ID", isReadOnly: true },
  production_log_id: {
    id: "production_log_id",
    label: "Production Log ID",
    isReadOnly: true,
  },
  start_time: {
    id: "start_time",
    label: "Start Time",
  },
  end_time: {
    id: "end_time",
    label: "End Time",
  },
  task_type: {
    id: "task_type",
    label: "Task Type",
  },
  content: {
    id: "content",
    label: "Content",
  },
  quantity: {
    id: "quantity",
    label: "Quantity",
  },
  product_type: {
    id: "product_type",
    label: "Product Type",
  },
  pkg_received: {
    id: "pkg_received",
    label: "Pkg Received",
  },
  pkg_returned: {
    id: "pkg_returned",
    label: "Pkg Returned",
  },
  pkg_damaged: {
    id: "pkg_damaged",
    label: "Pkg Damaged",
  },
};
