import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRoles: number[];
}

const PermissionGate = ({ children, allowedRoles }: Props) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role;

  const hasPermission = allowedRoles.includes(Number(userRole));

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};

export default PermissionGate;
