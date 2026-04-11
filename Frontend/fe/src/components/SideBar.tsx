import type { Theme, CSSObject } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GradingIcon from "@mui/icons-material/Grading";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router";
import NavItem from "./NavItem";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";

const drawerWidth = 240;
const themeColor = {
  bg: "#22C55E",
  text: "white",
};

const drawerMixin = (theme: Theme, open: boolean): CSSObject => ({
  width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: open
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
  }),
  // overflowX: "hidden",
  backgroundColor: themeColor.bg,
  color: themeColor.text,
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : `calc(${theme.spacing(8)} + 1px)`,
    backgroundColor: themeColor.bg,
    color: themeColor.text,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...drawerMixin(theme, open),
}));

interface SideBarProps {
  open: boolean;
  onOpen: () => void;
  onTitleChange: (title: string) => void;
}

const SideBar = ({ open, onOpen, onTitleChange }: SideBarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { full_name, role, id } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      text: "Dashboard",
      icon: <SpaceDashboardOutlinedIcon />,
      path: "/dashboard",
      minRole: 5,
    },
    { text: "Order", icon: <AssignmentIcon />, path: "/" },
    {
      text: "Material Report",
      icon: <InventoryIcon />,
      path: "/material-report",
    },
    {
      text: "Product Report",
      icon: <AssignmentTurnedInIcon />,
      path: "/production-report",
    },
    { text: "Production Log", icon: <GradingIcon />, path: "/production-log" },
    { text: "Formulas", icon: <ScienceOutlinedIcon />, path: "/formula" },
  ];
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.text === "Dashboard" && Number(id) > 5) {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // localStorage.clear();
    dispatch(logout());
    navigate("/login");
  };
  return (
    <Drawer variant="permanent" open={open}>
      <Box sx={{ flex: 1 }}>
        <DrawerHeader>
          {open && (
            <Typography variant="h6" noWrap>
              TITLE NAME
            </Typography>
          )}
          <IconButton onClick={onOpen}>
            {/* {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />} */}
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <NavItem
            open={open}
            icon={<PersonIcon />}
            text={full_name}
            subtext={role}
            onClick={() => {
              console.log();
            }}
            isUser
          />
        </List>
        <Divider />
        <List>
          {filteredMenuItems.map((item) => {
            return (
              <NavItem
                key={item.path}
                open={open}
                icon={item.icon}
                text={item.text}
                onClick={() => {
                  onTitleChange(item.text);
                  navigate(item.path);
                }}
                active={pathname === item.path}
              />
            );
          })}
        </List>
      </Box>
      <Divider />
      <List>
        <NavItem
          open={open}
          icon={<LogoutIcon />}
          text={"Logout"}
          onClick={handleLogout}
        />
      </List>
    </Drawer>
  );
};

export default SideBar;
