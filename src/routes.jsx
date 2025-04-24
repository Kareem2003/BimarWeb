import { useRoutes } from "react-router-dom";
import ProtectedRoute from "./helpers/ProtectedRoute";
import LoginScreen from "./pages/Login";
import RegisterScreen from "./pages/Register";
import ForgetPasswordScreen from "./pages/ForgetPassword";
import OTPScreen from "./pages/OTP";
import Layout from "./components/Layout";
import ChatScreen from "./pages/Chat";
import ProfileScreen from "./pages/Profile";
import { DOCTOR_INFO } from "./helpers/constants/StaticKeys";
import DashboardScreen from "./pages/Dashboard";
import AccessScreen from "./pages/Access";
import MedicalRecordsScreen from "./pages/MedicalRecords";
import ResetPasswordScreen from './pages/ResetPassword';
import AdminDashboard from './pages/admin';
import BookingsList from './pages/admin/components/BookingsList';
import DoctorRequests from './pages/admin/components/DoctorRequests';
import DoctorsList from './pages/admin/components/DoctorsList';
import PatientsList from './pages/admin/components/PatientsList';

const Routers = () => {
  return useRoutes([
    { path: "/login", element: <LoginScreen /> },
    { path: "/register", element: <RegisterScreen /> },
    { path: "/forget-password", element: <ForgetPasswordScreen /> },
    { path: "/otp", element: <OTPScreen /> },
    { path: "/reset-password", element: <ResetPasswordScreen /> },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Layout>
            <ProfileScreen />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/medicalRecords",
      element: (
        <ProtectedRoute>
          <Layout>
            <MedicalRecordsScreen />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/access/",
      element: (
        <ProtectedRoute>
          <Layout>
            <AccessScreen />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute requireAdmin={false}>
          <Layout>
            <DashboardScreen />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute requireAdmin={false}>
          <Layout>
            <DashboardScreen />
          </Layout>
        </ProtectedRoute>
      ),
    },
    { 
      path: "/admin", 
      element: (
        <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: "bookings", element: <BookingsList /> },
        { path: "doctors", element: <DoctorsList /> },
        { path: "patients", element: <PatientsList /> },
        { path: "requests", element: <DoctorRequests /> },
      ]
    },
  ]);
};

export default Routers;
