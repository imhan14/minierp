import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";

interface HeaderProps {
  open: boolean;
  title?: string;
  drawerWidth?: number;
  closedWidth?: number;
}

const PageHeader = ({ open, title, drawerWidth, closedWidth }: HeaderProps) => {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        width: `calc(100% - ${open ? drawerWidth : closedWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
