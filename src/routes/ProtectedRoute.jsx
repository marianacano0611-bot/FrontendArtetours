import { Navigate, useLocation } from "react-router";

export function ProtectedRoute({ children }) {
    const location = useLocation();
    const token = window.localStorage.getItem("artetours_token");
    if (!token) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }
    return <>{children}</>;
}
