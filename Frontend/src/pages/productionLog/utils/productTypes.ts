export const PRODUCTION_PRODUCT_TYPES = [
  { label: "Sang bao", value: "sb" },
  { label: "Mùa khô", value: "mk" },
  { label: "1 hạt", value: "mh" },
  { label: "Nhỏ giọt", value: "ng" },
  { label: "Trộn", value: "tr" },
];

export const getProductionProductTypeLabel = (value: string): string =>
  PRODUCTION_PRODUCT_TYPES.find((item) => item.value === value)?.label ?? value;
