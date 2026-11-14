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
        color: "text.primary",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        boxShadow: "0 1px 0 rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(12px)",
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 650, letterSpacing: "-0.02em" }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
