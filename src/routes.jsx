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
import AccessPasswordScreen from "./pages/AccessPassword";

const Routers = () => {
  return useRoutes([
    { path: "login", element: <LoginScreen /> },
    { path: "register", element: <RegisterScreen /> },
    { path: "forget-password", element: <ForgetPasswordScreen /> },
    { path: "otp", element: <OTPScreen /> },
    {
      path: "chat",
      element: (
        <ProtectedRoute>
          <Layout>
            <ChatScreen />
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
      children: [
        {
          path: "profile",
          element: <ProfileScreen />,
        },
        {
          path: "access-password",
          element: <AccessPasswordScreen />,
        },
      ],
    },
  ]);
};

export default Routers;
