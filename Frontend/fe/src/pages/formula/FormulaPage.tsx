import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";
import Filters from "../../components/Filters";
import { styled } from "@mui/material";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const FormulaPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  return (
    <>
      <DrawerHeader />
      <Filters selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </>
  );
};

export default FormulaPage;
