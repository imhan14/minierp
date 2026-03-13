import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
import api from "../apis/axios";
import DynamicPopup from "../components/DynamicPopup";

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
  const [materialReports, setMaterialReports] = useState<
    MaterialReportDisplay[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialReportDisplay | null>(null);

  const materialReportColumn: ColumnConfig<MaterialReportDisplay>[] = [
    { id: "id", label: "id" },
    { id: "team_name", label: "Team Name" },
    {
      id: "report_date",
      label: "Report Date",
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("DD/MM/YYYY");
      }) as ColumnConfig<MaterialReportDisplay>["render"],
    },
    { id: "shift", label: "Shift" },
    {
      id: "start_time",
      label: "Start Time",
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as ColumnConfig<MaterialReportDisplay>["render"],
    },
    {
      id: "end_time",
      label: "End Time",
      render: ((value: string) => {
        if (!value) return "-";
        return dayjs(value).add(24, "hour").format("HH:mm");
      }) as ColumnConfig<MaterialReportDisplay>["render"],
    },
    { id: "actions", label: "Details", align: "center" },
    // { id: "foreman_check", label: "Foreman Check" },
  ];
  const handleOpenDetail = (row: MaterialReportDisplay) => {
    setSelectedMaterial(row);

    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setTimeout(() => {
      setSelectedMaterial(null);
    }, 300);
  };
  const actions: ActionConfig<MaterialReportDisplay>[] = [
    {
      label: "Details",
      color: "primary",
      icon: <RemoveRedEyeOutlinedIcon />,
      onClick: (row) => handleOpenDetail(row),
    },
  ];
  const fetchMaterialReport = async (date?: Dayjs | null) => {
    try {
      setLoading(true);
      const dateParam = date?.isValid() ? date.format("YYYY-MM-DD") : "";
      const response = await api.get<MaterialReportType[]>(`/material-report`, {
        params: { date: dateParam },
      });
      const formattedData: MaterialReportDisplay[] = response.data.map(
        (item) => {
          const { teams, ...rest } = item;
          return {
            ...rest,
            team_id: teams?.id,
            team_name: teams?.team_name || "N/A",
          };
        },
      );
      console.log(response.data);
      setMaterialReports(formattedData);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialReport(selectedDate);
  }, [selectedDate]);
  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }
  return (
    <Box>
      <DrawerHeader />
      <Filters selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={materialReportColumn}
          data={materialReports}
          actions={actions}
          getRowKey={(row) => row.id}
        />
      )}
      <DynamicPopup
        open={openDetail}
        onClose={handleCloseDetail}
        title={`Details: #${selectedMaterial?.id}`}
      >
        asdsd
      </DynamicPopup>
    </Box>
  );
};

export default MaterialReportPage;
