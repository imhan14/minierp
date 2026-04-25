import { InputAdornment, MenuItem, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import type { FormulaFilters } from "@/apis/formulaApi";

const IngredientFilterUI = ({
  onFilterChange,
}: {
  onFilterChange?: (filters: FormulaFilters) => void;
}) => {
  const [filters, setFilters] = useState({
    search: "",
    unit: "",
    orderBy: "",
  });
  const filterOptions = [
    {
      id: "unit",
      label: "Unit",
      options: [
        { label: "Kg", value: "Kg" },
        { label: "Lit", value: "lit" },
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
  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        mb: 3,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 60,
        zIndex: 10,
        flexWrap: "wrap",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search name..."
        size="small"
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
        sx={{
          maxWidth: "220px",
          "& .MuiOutlinedInput-root": { borderRadius: 2 },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
      />
      {filterOptions.map((item) => {
        const isDefaultValue = filters[item.id as keyof typeof filters] === "";
        return (
          <TextField
            size="small"
            label={item.label}
            select
            value={filters[item.id as keyof typeof filters]}
            onChange={(e) => {
              handleChange(item.id, e.target.value);
            }}
            SelectProps={{
              displayEmpty: true,
            }}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{
              width: 120,
              "& .MuiSelect-select": {
                color: isDefaultValue ? "text.secondary" : "inherit",
                fontStyle: isDefaultValue ? "italic" : "normal",
                opacity: isDefaultValue ? 0.8 : 1,
              },
            }}
          >
            <MenuItem value="">
              {item.id === "orderBy" ? "ID: A-Z" : <em>All</em>}
            </MenuItem>

            {item.options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        );
      })}
    </Paper>
  );
};

export default IngredientFilterUI;
