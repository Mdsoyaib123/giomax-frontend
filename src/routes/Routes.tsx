import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AdminLayout from "@/Layout/AdminLayout";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import SettingsPage from "@/pages/Admin/SettingsPage";
import ClientDashboardPage from "@/pages/Client/ClientDashboardPage";
import ClientLayout from "@/Layout/ClientLayout";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import PatientManagementPage from "@/pages/Admin/PatientManagementPage";
import PaymentHistory from "@/components/AdminDashboard/PatientManagement/PaymentHistory";
import Settings from "@/components/AdminDashboard/Settings/Settings";
import BookingManagementPage from "@/pages/Admin/BookingManagementPage";
import PaymentsPage from "@/pages/Admin/PaymentsPage";
import DoctorManagementPage from "@/pages/Admin/DoctorManagementPage";
import ClinicManagementPage from "@/pages/Admin/ClinicManagementPage";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },

       {
        path: "/settings",
        element: <Settings />,
      },

      
    ],
  },

  /* Client Dashboard */
  {
    path: "/client-dashboard",
    element: <ClientLayout />,
    children: [
      { index: true, element: <ClientDashboardPage /> },
      { path: "dashboard", element: <ClientDashboardPage /> },
    ],
  },

  /* Admin Dashboard */
  {
    path: "/admin-dashboard",
    element: (
      // <AdminRoute>
      <AdminLayout />
      // </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "patient-management", element: <PatientManagementPage /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "booking-management", element: <BookingManagementPage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "doctor-management", element: <DoctorManagementPage /> },
      { path: "clinic-management", element: <ClinicManagementPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
