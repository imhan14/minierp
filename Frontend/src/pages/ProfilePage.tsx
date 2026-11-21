import { Box, Card, CardContent, Typography } from "@mui/material";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Profile
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Personal information
          </Typography>
          <Typography>Name: {user.full_name || "-"}</Typography>
          <Typography>Username: {user.username || "-"}</Typography>
          <Typography>Role: {user.role ?? "-"}</Typography>
          <Typography>Team: {user.team_name || "-"}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
