import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import PageHeader from "../components/PageHeader";
import SideBar from "../components/SideBar";

const drawerWidth = 240;
const closedWidth = 64;

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("Dashboard");

  const handleToggleSideBar = () => {
    setOpen(!open);
  };
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#cbffde",
        overflowX: "hidden",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <PageHeader
        title={title}
        open={open}
        drawerWidth={drawerWidth}
        closedWidth={closedWidth}
      />
      <SideBar
        open={open}
        onOpen={handleToggleSideBar}
        onTitleChange={setTitle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
          }}
        >
          <Outlet context={[setTitle]} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
