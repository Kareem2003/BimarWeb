import { Navigate } from "react-router-dom";
import { AUTHENTICATION_TOKEN } from "./constants/StaticKeys";

const ProtectedRoute = ({ children }) => {
  let token = localStorage.getItem(AUTHENTICATION_TOKEN);
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
