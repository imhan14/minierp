import { createBrowserRouter, Navigate } from "react-router";
import NotFound from "../pages/NotFound";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AuthLayout from "../layouts/AuthLayout";
import ProductionReportPage from "../pages/productionReport";
import ProductionLogPage from "../pages/productionLog";
import MaterialReportPage from "../pages/materialReport";
import ProtectedRoute from "../components/ProtectedRoute";
import FormulaPage from "../pages/formula";
import ManagePage from "@/pages/ManagePage";
import ProductPage from "@/pages/admin/product";
import IngredientPage from "@/pages/admin/ingredient";
import UserPage from "@/pages/manage/user";
import RoleTeamPage from "@/pages/manage/roleAndTeam";
import { getAllowedRoles } from "@/utils/roleAccess";
import RoleLandingRedirect from "@/components/RoleLandingRedirect";
import ProfilePage from "@/pages/ProfilePage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import WarehousePage from "@/pages/warehouse/WarehousePage";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <UserLayout />,
        children: [
          { index: true, element: <RoleLandingRedirect /> },
          {
            element: <ProtectedRoute allowedRoles={getAllowedRoles("/order")} />,
            children: [{ path: "/order", element: <Home /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={getAllowedRoles("/profile")} />,
            children: [{ path: "/profile", element: <ProfilePage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={getAllowedRoles("/warehouse")} />,
            children: [{ path: "/warehouse", element: <WarehousePage /> }],
          },
          {
            element: (
              <ProtectedRoute
                allowedRoles={getAllowedRoles("/production-report")}
              />
            ),
            children: [
              { path: "/production-report", element: <ProductionReportPage /> },
            ],
          },
          {
            element: (
              <ProtectedRoute
                allowedRoles={getAllowedRoles("/production-log")}
              />
            ),
            children: [
              { path: "/production-log", element: <ProductionLogPage /> },
            ],
          },
          {
            element: (
              <ProtectedRoute
                allowedRoles={getAllowedRoles("/material-report")}
              />
            ),
            children: [
              { path: "/material-report", element: <MaterialReportPage /> },
            ],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={getAllowedRoles("/dashboard")} />
            ),
            children: [{ path: "/dashboard", element: <Dashboard /> }],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={getAllowedRoles("/formula")} />
            ),
            children: [{ path: "/formula", element: <FormulaPage /> }],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={getAllowedRoles("/ingredient")} />
            ),
            children: [{ path: "/ingredient", element: <IngredientPage /> }],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={getAllowedRoles("/product")} />
            ),
            children: [{ path: "/product", element: <ProductPage /> }],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={getAllowedRoles("/manage")} />
            ),
            children: [
              {
                path: "/manage",
                element: <ManagePage />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="/manage/user" replace />,
                  },
                  {
                    path: "user",
                    element: <UserPage />,
                  },
                  { path: "role", element: <RoleTeamPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: "/403", element: <ForbiddenPage /> },
      {
        element: <ProtectedRoute allowedRoles={getAllowedRoles("/admin")} />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                // path: "/dashboard",
                element: <Dashboard />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
