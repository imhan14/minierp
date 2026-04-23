import { createBrowserRouter } from "react-router";
import NotFound from "../pages/NotFound";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/Login";
import AuthLayout from "../layouts/AuthLayout";
import ProductionReportPage from "../pages/productionReport";
import ProductionLogPage from "../pages/productionLog";
import MaterialReportPage from "../pages/materialReport";
import ProtectedRoute from "../components/ProtectedRoute";
import FormulaPage from "../pages/formula";
import IngredientPage from "@/pages/ingredientPage";

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
            // path: "/order",
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
          {
            element: <ProtectedRoute allowedRoles={[1, 2, 3, 4]} />,
            children: [{ path: "/dashboard", element: <Dashboard /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={[1, 2, 3, 4]} />,
            children: [{ path: "/formula", element: <FormulaPage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={[1, 2, 3, 4]} />,
            children: [{ path: "/ingredient", element: <IngredientPage /> }],
          },
        ],
      },
      {
        // element: <ProtectedRoute />,
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
