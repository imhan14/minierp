import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { getWorkplacePath } from "@/utils/roleAccess";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: 2,
        bgcolor: "#f4f7f5",
      }}
    >
      <Paper sx={{ maxWidth: 520, p: 4, textAlign: "center" }} elevation={2}>
        <Typography variant="h2" color="error" fontWeight={700}>
          403
        </Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>
          Forbidden
        </Typography>
        <Typography color="text.secondary" sx={{ my: 2 }}>
          You do not have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(getWorkplacePath(Number(user.role)), { replace: true })}
        >
          Return to my workspace
        </Button>
      </Paper>
    </Box>
  );
};

export default ForbiddenPage;
