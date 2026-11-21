import { Navigate } from "react-router";
import { getWorkplacePath } from "@/utils/roleAccess";

const RoleLandingRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return <Navigate to={getWorkplacePath(Number(user.role))} replace />;
};

export default RoleLandingRedirect;
