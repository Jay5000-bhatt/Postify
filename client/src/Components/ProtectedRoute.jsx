import { Navigate } from "react-router-dom";
import isTokenValid  from "../Utils/Auth";

const ProtectedRoute = ({ children }) => {
  const isAuth = isTokenValid("token");
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
