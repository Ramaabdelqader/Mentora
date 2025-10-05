import { useAuth } from "../context/AuthContext";

export default function RoleGate({ roles = [], fallback = null, children }) {
  const { user } = useAuth();
  if (!user) return fallback;
  if (roles.length && !roles.includes(user.role)) return fallback;
  return children;
}
