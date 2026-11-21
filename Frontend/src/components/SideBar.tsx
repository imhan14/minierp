import type { Theme, CSSObject } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Collapse, Typography } from "@mui/material";
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
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import AllInboxOutlinedIcon from "@mui/icons-material/AllInboxOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import GamepadOutlinedIcon from "@mui/icons-material/GamepadOutlined";
import { useState, type ReactElement } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import { canAccessPath } from "@/utils/roleAccess";
const drawerWidth = 240;
const themeColor = {
  bg: "#15803d",
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
  boxShadow: "none",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : `calc(${theme.spacing(8)} + 1px)`,
    backgroundColor: themeColor.bg,
    color: themeColor.text,
    overflowX: "hidden",
    borderRight: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "none",
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

interface MenuItem {
  text: string;
  icon: ReactElement;
  path: string;
  children?: MenuItem[];
}

const SideBar = ({ open, onOpen, onTitleChange }: SideBarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { full_name, role } = useSelector((state: RootState) => state.auth);
  const userRole = Number(JSON.parse(localStorage.getItem("user") || "{}").role);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const toggleExpand = (text: string) => {
    setExpandedItems((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const menuItems: MenuItem[] = [
    {
      text: "Dashboard",
      icon: <SpaceDashboardOutlinedIcon />,
      path: "/dashboard",
    },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "Warehouse", icon: <WarehouseOutlinedIcon />, path: "/warehouse" },
    { text: "Order", icon: <AssignmentIcon />, path: "/order" },
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
    {
      text: "Formulas",
      icon: <ScienceOutlinedIcon />,
      path: "/formula",
    },
    {
      text: "Ingredient",
      icon: <Co2OutlinedIcon />,
      path: "/ingredient",
    },
    {
      text: "Product",
      icon: <AllInboxOutlinedIcon />,
      path: "/product",
    },
    {
      text: "Manage",
      icon: <GroupOutlinedIcon />,
      path: "/manage",
      children: [
        { text: "User", icon: <GroupOutlinedIcon />, path: "/manage/user" },
        {
          text: "Role & Team",
          icon: <GamepadOutlinedIcon />,
          path: "/manage/role",
        },
      ],
    },
  ];
  const filteredMenuItems = menuItems.flatMap((item) => {
    if (item.children) {
      const children = item.children.filter((child) =>
        canAccessPath(child.path, userRole),
      );
      return children.length > 0 ? [{ ...item, children }] : [];
    }
    return canAccessPath(item.path, userRole) ? [item] : [];
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
          {filteredMenuItems.map((item) => (
            <Box key={item.path}>
              <NavItem
                open={open}
                text={item.text}
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.text);
                  } else {
                    onTitleChange(item.text);
                    navigate(item.path);
                  }
                }}
                active={pathname === item.path}
                icon={
                  item.children ? (
                    expandedItems[item.text] ? (
                      <ExpandLessOutlinedIcon />
                    ) : (
                      <ExpandMoreOutlinedIcon />
                    )
                  ) : (
                    item.icon
                  )
                }
              />
              {item.children && (
                <Collapse
                  in={
                    expandedItems[item.text] || pathname.startsWith(item.path)
                  }
                >
                  {item.children.map((child) => (
                    <NavItem
                      key={child.path}
                      open={open}
                      icon={child.icon}
                      text={child.text}
                      onClick={() => {
                        onTitleChange(child.text);
                        navigate(child.path);
                      }}
                      active={pathname === child.path}
                      sx={{ pl: open ? 4 : 0 }}
                    />
                  ))}
                </Collapse>
              )}
            </Box>
          ))}
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
