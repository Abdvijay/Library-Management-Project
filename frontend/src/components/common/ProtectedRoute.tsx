import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";

import { getToken, getUser } from "../../services/authStorage";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"LIBRARIAN" | "MEMBER">;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "LIBRARIAN") {
      return <Navigate to="/dashboard" />;
    }

    return <Navigate to="/my-dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;