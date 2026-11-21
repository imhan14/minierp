import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import SideBar from "../components/SideBar";
import { Box, CssBaseline } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const drawerWidth = 240;
const closedWidth = 64;

const UserLayout = () => {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("Order");
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/profile": "Profile",
      "/warehouse": "Warehouse",
      "/order": "Order",
      "/material-report": "Material Report",
      "/production-report": "Product Report",
      "/production-log": "Production Log",
      "/formula": "Formulas",
      "/ingredient": "Ingredient",
      "/product": "Product",
      "/manage/user": "User",
      "/manage/role": "Role & Team",
    };
    setTitle(pageTitle[pathname] ?? "");
  }, [pathname]);

  const handleToggleSideBar = () => {
    setOpen(!open);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#f4f7f5",
          height: "100dvh",
          minHeight: 0,
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
            height: "100dvh",
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              minWidth: 0,
              p: { xs: 1.5, sm: 2, md: 3 },
              overscrollBehavior: "contain",
            }}
          >
            <Outlet context={[setTitle]} />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default UserLayout;
