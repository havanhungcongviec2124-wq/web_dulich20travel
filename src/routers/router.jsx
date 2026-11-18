import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../web/Home";
import Search from "../web/Search";
import ServiceDetail from "../web/ServiceDetail";
import Contact from "../web/Contact";
import AdminLogin from "../admin/AdminLogin";
import AdminLayout from "../admin/AdminLayout";
import AdminOverview from "../admin/AdminOverview";
import AdminServices from "../admin/AdminServices";
import AdminPricing from "../admin/AdminPricing";
import AdminExcel from "../admin/AdminExcel";
import AdminConsultants from "../admin/AdminConsultants";
import AdminContent from "../admin/AdminContent";
import AdminHistory from "../admin/AdminHistory";

const router = createBrowserRouter([
  // 1. Client public website
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "tra-cuu",
        element: <Search />,
      },
      {
        path: "dich-vu",
        element: <Search />,
      },
      {
        path: "dich-vu/:slug",
        element: <ServiceDetail />,
      },
      {
        path: "chi-tiet/:slug",
        element: <ServiceDetail />,
      },
      {
        path: "lien-he",
        element: <Contact />,
      },
    ],
  },
  // 2. Admin Login
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  // 3. Admin Workspace
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: "dich-vu",
        element: <AdminServices />,
      },
      {
        path: "bang-gia",
        element: <AdminPricing />,
      },
      {
        path: "excel",
        element: <AdminExcel />,
      },
      {
        path: "nhan-vien",
        element: <AdminConsultants />,
      },
      {
        path: "noi-dung",
        element: <AdminContent />,
      },
      {
        path: "lich-su",
        element: <AdminHistory />,
      },
    ],
  },
  // 4. Catch all -> redirect to home
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
]);

export default router;
