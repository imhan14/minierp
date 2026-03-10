import { Box } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Filters from "../components/Filters";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DataTable, {
  type ActionConfig,
  type ColumnConfig,
} from "../components/DataTable";
import type { MaterialReportType } from "../types/MaterialReportType";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface MaterialReportDisplay extends Omit<MaterialReportType, "teams"> {
  team_name: string;
}

const MaterialReportPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const materialReportColumn: ColumnConfig<MaterialReportDisplay>[] = [
    { id: "id", label: "id" },
    { id: "team_name", label: "Team Name" },
    { id: "report_date", label: "Report Date" },
    { id: "shift", label: "Shift" },
    { id: "start_time", label: "Start Time" },
    { id: "end_time", label: "End Time" },
    // { id: "foreman_check", label: "Foreman Check" },
  ];
  const materialReports: MaterialReportDisplay[] = [
    {
      id: 1,
      team_name: "Team 1",
      report_date: "02/03/2026",
      shift: "C1",
      start_time: "7:00",
      end_time: "8:00",
      foreman_check: false,
      extral_materials: [],
    },
    {
      id: 2,
      team_name: "Team 1",
      report_date: "02/03/2026",
      shift: "C1",
      start_time: "7:00",
      end_time: "8:00",
      foreman_check: false,
      extral_materials: [],
    },
    {
      id: 3,
      team_name: "Team 1",
      report_date: "02/03/2026",
      shift: "C1",
      start_time: "7:00",
      end_time: "8:00",
      foreman_check: false,
      extral_materials: [],
    },
  ];
  const actions: ActionConfig<MaterialReportDisplay>[] = [
    {
      label: "Details",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: (row) => console.log(row),
    },
  ];
  return (
    <Box>
      <DrawerHeader />
      <Filters selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Box>
        <DataTable
          columns={materialReportColumn}
          data={materialReports}
          actions={actions}
          getRowKey={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default MaterialReportPage;
