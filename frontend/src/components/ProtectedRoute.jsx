import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// allowedRoles: Optional array of roles allowed to access the route.
// If not provided, only checks if user is authenticated.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // Show a loading indicator while checking authentication
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    // User not logged in, redirect to login page
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles if allowedRoles is provided
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User role not allowed, redirect to an unauthorized page or home
    // For simplicity, redirecting to home page here
    console.warn(`Access denied for role "${user?.role}" to path "${location.pathname}". Allowed: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />; // Or to a specific '/unauthorized' page
  }

  // User is authenticated and has the correct role (if required)
  return children;
};

export default ProtectedRoute;