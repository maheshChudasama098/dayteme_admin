import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { AuthRoutes } from "./routes";

const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={AuthRoutes.Login} replace />
  );
};

export default AuthRoute;
