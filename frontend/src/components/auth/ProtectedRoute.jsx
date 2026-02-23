import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if token is expired
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = payload.exp * 1000;
        if (Date.now() >= expiryTime) {
          useAuthStore.setState({ token: null, user: null });
          localStorage.removeItem("sms_auth");
        }
      } catch {
        // Token parsing failed, ignore
      }
    }
    setIsReady(true);
  }, [token]);

  if (!isReady) {
    return <div />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
