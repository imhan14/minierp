import {
  FormControl,
  IconButton,
  InputAdornment,
  // MenuItem,
  Paper,
  // Select,
  TextField,
  Typography,
  // type SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Dayjs } from "dayjs";
// import { useLocation } from "react-router";

interface Filters {
  selectedDate: Dayjs | null;
  setSelectedDate: (value: Dayjs | null) => void;
}

const Filters = ({ selectedDate, setSelectedDate }: Filters) => {
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
        top: 80,
        zIndex: 10,
        flexWrap: "wrap",
      }}
    >
      <Typography sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
        Filters:
      </Typography>
      <DatePicker
        label="Pick date"
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            sx: { maxWidth: "200px" },
            size: "small",
            fullWidth: true,
          },
        }}
      />
      <TextField
        variant="outlined"
        placeholder="Search..."
        size="small"
        fullWidth
        sx={{
          maxWidth: "400px",
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
    </Paper>
  );
};

export default Filters;
