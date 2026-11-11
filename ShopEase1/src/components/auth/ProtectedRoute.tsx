import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

// A doorman for a group of pages: logged-in visitors pass, others go to /login.
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
