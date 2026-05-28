import { styled } from "@mui/material";

//PopupMode
export type PopupMode = "closed" | "edit" | "add";

//DrawerHeader
export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
