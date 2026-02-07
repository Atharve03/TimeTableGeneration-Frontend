import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  if (!token) return <Navigate to="/" />;

  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/" />;

  return children;
}
