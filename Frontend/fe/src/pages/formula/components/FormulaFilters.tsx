import { InputAdornment, MenuItem, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import type { FormulaFilters } from "@/apis/formulaApi";

const FormulaFilters = ({
  onFilterChange,
}: {
  onFilterChange?: (filters: FormulaFilters) => void;
}) => {
  const [filters, setFilters] = useState({
    search: "",
    active: "",
    line: "",
    specification: "",
    color: "",
    typeOfSpecification: "",
    orderBy: "",
  });
  const filterOptions = [
    {
      id: "active",
      label: "Active",
      options: [
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ],
    },
    {
      id: "line",
      label: "Line",
      options: [
        { label: "Trộn", value: "tron" },
        { label: "Sang Bao", value: "sangbao" },
        { label: "1 Hạt", value: "mothat" },
      ],
    },
    {
      id: "specification",
      label: "Specification",
      options: [{ label: "BTP", value: "btp" }],
    },
    {
      id: "color",
      label: "Color",
      options: [
        { label: "3 Màu", value: "bamau" },
        { label: "Xám", value: "xam" },
      ],
    },
    {
      id: "typeOfSpecification",
      label: "Type of Specification",
      options: [
        { label: "50kg", value: "50Kg" },
        { label: "25kg", value: "25Kg" },
      ],
    },
    {
      id: "orderBy",
      label: "Order By",
      options: [
        { label: "ID: A - Z", value: "id:asc" },
        { label: "Name: A-Z", value: "formula_name:asc" },
        { label: "Name: Z-A", value: "formula_name:desc" },
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
        top: 80,
        zIndex: 10,
        flexWrap: "wrap",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search code, name..."
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
      {filterOptions.map((item) => (
        <TextField
          size="small"
          label={item.label}
          select
          value={filters[item.id as keyof typeof filters]}
          defaultValue="True"
          onChange={(e) => {
            handleChange(item.id, e.target.value);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: 120 }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {item.options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      ))}
    </Paper>
  );
};

export default FormulaFilters;
