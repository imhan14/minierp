import { createBrowserRouter } from "react-router";
import NotFound from "../pages/NotFound";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import AuthLayout from "../layouts/AuthLayout";
import ProductionReportPage from "../pages/ProductionReportPage";
import ProductionLogPage from "../pages/ProductionLogPage";
import MaterialReportPage from "../pages/MaterialReportPage";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
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
          {
            index: true,
            element: <Home />,
          },
          {
            path: "/production-report",
            element: <ProductionReportPage />,
          },
          {
            path: "/production-log",
            element: <ProductionLogPage />,
          },
          {
            path: "/material-report",
            element: <MaterialReportPage />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
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
