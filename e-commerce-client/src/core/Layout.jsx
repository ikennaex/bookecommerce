import React from "react";
import Navbar from "./components/Navbar";
const Layout = ({
  title = "title",
  description = "description",
  className,
  children,
}) => {
  return (
    <>
      <Navbar />
      <div className="jumbotron">
        <h2>{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </>
  );
};

export default Layout;
