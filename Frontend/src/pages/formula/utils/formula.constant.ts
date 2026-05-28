export const ACTIVE_OPTIONS = [
  { value: "true", label: "Active", bg: "#e8f5e9", text: "#2e7d32" },
  { value: "false", label: "Inactive", bg: "#ffebee", text: "#c62828" },
];
export const PRODUCT_LINE_OPTIONS = [
  { label: "Trộn", value: "tron" },
  { label: "Sang Bao", value: "sangbao" },
  { label: "1 hạt", value: "mothat" },
];
export const SPEC_TYPE_OPTIONS = [
  { label: "25 Kg", value: "25Kg" },
  { label: "50 Kg", value: "50Kg" },
];
export const SPECIFICATION_OPTIONS = [
  { label: "Bao thành phẩm", value: "btp" },
];
export const COLOR_OPTIONS = [
  { label: "3 màu", value: "bamau" },
  { label: "Xám", value: "xam" },
];

export const filterOptions = [
  {
    id: "active",
    label: "Active",
    options: ACTIVE_OPTIONS,
  },
  {
    id: "line",
    label: "Line",
    options: PRODUCT_LINE_OPTIONS,
  },
  {
    id: "specification",
    label: "Specification",
    options: SPECIFICATION_OPTIONS,
  },
  {
    id: "color",
    label: "Color",
    options: COLOR_OPTIONS,
  },
  {
    id: "typeOfSpecification",
    label: "Type of Specification",
    options: SPEC_TYPE_OPTIONS,
  },
  {
    id: "orderBy",
    label: "Order By",
    options: [
      { label: "ID: A-Z", value: "id:asc" },
      { label: "Name: A-Z", value: "formula_name:asc" },
      { label: "Name: Z-A", value: "formula_name:desc" },
    ],
  },
];
