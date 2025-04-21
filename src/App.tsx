import { useEffect } from "react";
import { AppRoutes } from "./routes/router";
import { useAuthStore } from "./store/authStore";

export const App = () => {
  // Initialize auth from localStorage if available (handled by zustand persist)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // We'll check for legacy auth tokens if any
  useEffect(() => {
    const legacyToken = localStorage.getItem("auth_token");
    if (legacyToken && !isAuthenticated) {
    
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }
  }, [isAuthenticated]);

  return <AppRoutes />;
};
