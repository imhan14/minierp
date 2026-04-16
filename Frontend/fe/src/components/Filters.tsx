import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { Dayjs } from "dayjs";
// import { useLocation } from "react-router";

interface Filters {
  selectedDate: Dayjs | null;
  setSelectedDate: (value: Dayjs | null) => void;
  mode: "single" | "range";
  setMode: (mode: "single" | "range") => void;
  children?: React.ReactNode;
  endDate?: Dayjs | null;
  setEndDate?: (value: Dayjs | null) => void;
}

const Filters = ({
  selectedDate,
  setSelectedDate,
  mode,
  setMode,
  children,
  endDate,
  setEndDate,
}: Filters) => {
  // const location = useLocation();
  // const [age, setAge] = useState("");

  // const handleChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value);
  // };
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
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, nextMode) => {
          if (nextMode) {
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
        onChange={(newValue) => setSelectedDate(newValue)}
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
      <TextField
        variant="outlined"
        placeholder="Search..."
        size="small"
        fullWidth
        sx={{
          maxWidth: "250px",
          borderRadius: 1.5,
          "& .MuiOutlinedInput-root": {
            color: "black",
            "& fieldset": {
              borderColor: "gray 0.5",
            },
            "&:hover fieldset": {
              borderColor: "black",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <SearchIcon sx={{ color: "gray" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* {location.pathname === "/production-log" && ( */}
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        {/* <Select
            value={age}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select> */}
        {/* <FormHelperText>Without label</FormHelperText> */}
      </FormControl>
      {/* )} */}
      <Box sx={{ flexGrow: 1 }} />
      {children}
    </Paper>
  );
};

export default Filters;
