import React from "react";
import { isAuthenticated } from "../../helperMethods/functions";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  if (isAuthenticated()) {
    const userRole = isAuthenticated().user.role;
    if (userRole === 1) {
      return children;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};
export default ProtectedAdminRoute;
