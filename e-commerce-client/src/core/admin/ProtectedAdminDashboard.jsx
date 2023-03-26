import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../helperMethods/functions";
import AdminDashboard from "./AdminDashboard";

const ProtectedAdminDashboard = () => {
  if (isAuthenticated()) {
    const userRole = isAuthenticated().user.role;
    if (userRole === 1) {
      return <AdminDashboard />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedAdminDashboard;
