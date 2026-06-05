import { Box } from "@mui/material";
import Role from "./Role";
import Team from "./Team";

const RoleTeamPage = () => {
  return (
    <Box
      display="flex"
      gap={3}
      sx={{
        width: "100%",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Role />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Team />
      </Box>
    </Box>
  );
};

export default RoleTeamPage;
