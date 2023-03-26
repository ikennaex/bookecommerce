import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout";
import { purchaseHistory } from "../../helperMethods/functions";
import { getUserInfo } from "../../helperMethods/functions";

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "",
    history: [],
  });

  const { name, email, role, history } = userInfo;

  const userLinks = () => {
    return (
      <>
        <div className="col-lg-3">
          <div className="card">
            <h4 className="card-header">User Links</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <Link className="nav-link" to="/user/cart">
                  My Cart
                </Link>
              </li>
              <li className="list-group-item">
                <Link className="nav-link" to="/profile/update">
                  Update Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getUserInfo(userInfo, setUserInfo);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Layout
        title="Dashboard"
        description={`Good day, ${name}`}
        className="container"
      >
        {loading && <p>Loading ...</p>}
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
            {purchaseHistory(history)}
          </div>
          {userLinks()}
        </div>
      </Layout>
    </>
  );
};

export default UserDashboard;
