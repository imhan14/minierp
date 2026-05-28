import Filters from "@/components/Filters";
import { DrawerHeader } from "@/utils/others";
import { Box } from "@mui/material";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";

const UserSetting = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  return (
    <Box>
      <DrawerHeader />
      <Filters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        mode={filterMode}
        setMode={setFilterMode}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </Box>
  );
};

export default UserSetting;
