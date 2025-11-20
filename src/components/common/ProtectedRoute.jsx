// src/components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageLoader } from "./LoadingSpinner";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <FullPageLoader text="Verifying authentication..." />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/access?tab=student-signin"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath =
      user.role === "lecturer"
        ? "/lecturer-dashboard?tab=overview"
        : "/student-dashboard?tab=overview";
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed, render protected component
  return children;
};

export default ProtectedRoute;
