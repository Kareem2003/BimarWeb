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

const Routers = () => {
  return useRoutes([
    { path: "/login", element: <LoginScreen /> },
    { path: "/register", element: <RegisterScreen /> },
    { path: "/forget-password", element: <ForgetPasswordScreen /> },
    { path: "/otp", element: <OTPScreen /> },
    { path: "/reset-password", element: <ResetPasswordScreen /> },
    // Move profile route out of children and make it a separate protected route
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
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout>
            <DashboardScreen />
          </Layout>
        </ProtectedRoute>
      ),
    }
  ]);
};

export default Routers;
