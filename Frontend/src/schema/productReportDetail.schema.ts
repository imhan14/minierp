import type { FieldConfig } from "../types/FieldConfig";
import type { ProductionReportDetailDisplay } from "../types/ProductReportDetailType";

export const productionReportDetailSchema: Record<
  string,
  FieldConfig<ProductionReportDetailDisplay>
> = {
  id: { id: "id", label: "ID" },
  product_name: {
    id: "product_name",
    label: "Product Name",
  },
  is_finish: {
    id: "is_finish",
    label: "Is Finish",
  },
  type_of_specification: {
    id: "type_of_specification",
    label: "Type Of Specification",
  },
  product_line: {
    id: "product_line",
    label: "Product Line",
  },
  specification: {
    id: "specification",
    label: "Specification",
  },
  start_time: {
    id: "start_time",
    label: "Start Time",
  },
  end_time: {
    id: "end_time",
    label: "End Time",
  },
  weight: {
    id: "weight",
    label: "Weight",
  },
  note: {
    id: "Note",
    label: "Note",
  },
} as const;
