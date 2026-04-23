import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Navigate, Outlet } from "react-router";
interface Props {
  allowedRoles?: number[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role;
  // const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        setIsAuth(true);
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuth(false);
        console.error(error);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuth === false) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(Number(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
