import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../helperMethods/functions";

const ProtectedUserRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedUserRoute;
