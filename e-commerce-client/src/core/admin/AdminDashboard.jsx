import React from "react";
import { isAuthenticated } from "../../helperMethods/functions";
import Layout from "../Layout";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const {
    user: { name, email, history, role },
  } = isAuthenticated();
  const adminLinks = () => {
    return (
      <>
        <div className="col-lg-3">
          <div className="card">
            <h4 className="card-header">Admin Links</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <Link className="nav-link" to="/category/create">
                  Add Category
                </Link>
              </li>
              <li className="list-group-item">
                <Link className="nav-link" to="/product/create">
                  Add Product
                </Link>
              </li>
              <li className="list-group-item">
                <Link className="nav-link" to="/products">
                  Manage Products
                </Link>
              </li>
              <li className="list-group-item">
                <Link className="nav-link" to="/view/orders">
                  View Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Layout
        title="Dashboard"
        description={`Good day, ${name}`}
        className="container"
      >
        <div className="row">
          <div className="col-lg-9">
            <div className="card mb-5">
              <h3 className="card-header">User Information</h3>
              <ul className="list-group">
                <li className="list-group-item"> {name}</li>
                <li className="list-group-item"> {email}</li>
                <li className="list-group-item">
                  {role === 0 ? "Registered User" : "Administrator"}
                </li>
              </ul>
            </div>
          </div>
          {adminLinks()}
        </div>
      </Layout>
    </>
  );
};

export default AdminDashboard;
