import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { type ReactElement } from "react";
// import type { Theme, CSSObject } from "@mui/material/styles";
// import { styled } from "@mui/material/styles";
// import MuiDrawer from "@mui/material/Drawer";

// const drawerWidth = 240;
// const themeColor = {
//   bg: "#22C55E",
//   text: "white",
// };

// const drawerMixin = (theme: Theme, open: boolean): CSSObject => ({
//   width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: open
//       ? theme.transitions.duration.enteringScreen
//       : theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   backgroundColor: themeColor.bg,
//   color: themeColor.text,
//   "& .MuiDrawer-paper": {
//     width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
//     backgroundColor: themeColor.bg,
//     color: themeColor.text,
//     transition: theme.transitions.create("width", {
//       easing: theme.transitions.easing.sharp,
//       duration: open
//         ? theme.transitions.duration.enteringScreen
//         : theme.transitions.duration.leavingScreen,
//     }),
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-around",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<{ open: boolean }>(({ theme, open }) => ({
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...drawerMixin(theme, open),
// }));

interface NavBarType {
  open: boolean;
  text: string;
  subtext?: string;
  active?: boolean;
  onClick?: () => void;
  icon: ReactElement;
  isUser?: boolean;
}

const NavItem = ({
  open,
  icon,
  text,
  onClick,
  active = false,
  subtext = "",
  isUser,
}: NavBarType) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={onClick}
        sx={{
          minHeight: 48,
          px: 2.5,
          justifyContent: open ? "initial" : "center",
          backgroundColor: active ? "rgba(255, 255, 255, 0.2)" : "transparent",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            py: isUser ? 1.9 : 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            color: "inherit",
          }}
        >
          {icon}
        </ListItemIcon>
        {open && (
          <ListItemText
            primary={text}
            secondary={subtext}
            secondaryTypographyProps={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.75rem",
            }}
            primaryTypographyProps={{ fontWeight: active ? 600 : 400 }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem;
