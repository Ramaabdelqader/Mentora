import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StaffOnly({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  const ok = user && ["admin", "instructor"].includes(user.role);
  if (!ok) {
    const redirect = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
}
