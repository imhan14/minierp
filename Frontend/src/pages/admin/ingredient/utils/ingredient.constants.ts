export const ingredientFilterOptions = [
  {
    id: "unit",
    label: "Unit",
    options: [
      { label: "Kg", value: "Kg" },
      { label: "Lit", value: "Lit" },
    ],
  },
  {
    id: "orderBy",
    label: "Order By",
    options: [
      { label: "ID: Z-A", value: "id:desc" },
      { label: "Name: A-Z", value: "ingredient_name:asc" },
      { label: "Name: Z-A", value: "ingredient_name:desc" },
    ],
  },
];
