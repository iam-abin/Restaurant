import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const authData = useAppSelector((state: RootState) => state.authReducer.authData); // Access auth data from state

  if (!authData) {
    return <Navigate to="/auth" />;
  }

  if (authData.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
