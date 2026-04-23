import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { type ReactElement } from "react";

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
