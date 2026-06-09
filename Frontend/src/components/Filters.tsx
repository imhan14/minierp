import {
  Box,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { Dayjs } from "dayjs";
import { useState } from "react";

export interface FilterOption {
  id: string;
  label: string;
  options?: { label: string; value: string }[];
}
interface Filters<T extends Record<string, unknown>> {
  initialFilters?: Partial<T>;
  onFilterChange?: (filters: T) => void;
  filterOptions?: FilterOption[];
  children?: React.ReactNode;
  // ---Date---
  showDateFilter?: boolean;
  mode?: "single" | "range";
  setMode?: (mode: "single" | "range") => void;
  selectedDate?: Dayjs | null;
  setSelectedDate?: (value: Dayjs | null) => void;
  endDate?: Dayjs | null;
  setEndDate?: (value: Dayjs | null) => void;
}

const Filters = <T extends Record<string, unknown>>({
  initialFilters,
  showDateFilter = false,
  selectedDate = null,
  setSelectedDate,
  mode = "single",
  setMode,
  children,
  endDate = null,
  setEndDate,
  onFilterChange,
  filterOptions = [],
}: Filters<T>) => {
  const [filters, setFilters] = useState<T>({
    search: "",
    orderBy: "",
    ...initialFilters,
  } as unknown as T);
  const handleChange = <K extends keyof T>(field: K, value: string) => {
    const newFilters = { ...filters, [field]: value as unknown as T[K] };
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
        // position: "sticky",
        top: 60,
        zIndex: 10,
        flexWrap: "wrap",
      }}
    >
      {/* DATE PICKER */}
      {showDateFilter && (
        <>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, nextMode) => {
              if (nextMode && setMode) {
                setMode(nextMode);

                if (nextMode === "single") {
                  setEndDate?.(null);
                } else if (nextMode === "range") {
                  setEndDate?.(selectedDate);
                }
              }
            }}
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="single">Một ngày</ToggleButton>
            <ToggleButton value="range">Bộ lọc</ToggleButton>
          </ToggleButtonGroup>

          <DatePicker
            label={mode === "single" ? "Chọn ngày" : "Từ ngày"}
            value={selectedDate}
            onChange={(newValue) => setSelectedDate?.(newValue)}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                sx: { maxWidth: "150px" },
                size: "small",
                fullWidth: true,
              },
            }}
          />
          {mode === "range" && (
            <DatePicker
              label="Đến ngày"
              value={endDate || null}
              onChange={(newValue) => {
                if (setEndDate) setEndDate(newValue);
              }}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  sx: { maxWidth: "150px" },
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          )}
        </>
      )}
      {/* SEARCH */}
      <TextField
        variant="outlined"
        placeholder="Search name..."
        size="small"
        value={filters.search as string}
        onChange={(e) => handleChange("search" as keyof T, e.target.value)}
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
      {/* FILTER OPTIONS */}
      {filterOptions.map((item) => {
        const currentValue = (filters[item.id as keyof T] as string) || "";
        const isDefaultValue = currentValue === "";
        return (
          <TextField
            key={item.id}
            size="small"
            label={item.label}
            select
            value={currentValue}
            onChange={(e) => {
              handleChange(item.id as keyof T, e.target.value);
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
              {item.id === "orderBy" ? "Default" : <em>All</em>}
            </MenuItem>

            {item.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        );
      })}
      <Box sx={{ flexGrow: 1 }} />
      {children}
    </Paper>
  );
};

export default Filters;
