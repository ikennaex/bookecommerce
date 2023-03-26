import React, { useEffect, useState } from "react";
import qs from "qs";
import { getUserInfo } from "../helperMethods/functions";
import Layout from "./Layout";
import { isAuthenticated } from "../helperMethods/functions";
import { Url } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "",
    history: [],
  });
  const { name, email, role, history } = userInfo;
  const [userUpdate, setUserUpdate] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
    setUserUpdate({ ...userUpdate, [name]: value });
    console.log(userUpdate);
  };

  const updateUserProfile = async (e, update) => {
    e.preventDefault();
    console.log(update);
    if (isAuthenticated() != false) {
      const { user, token } = isAuthenticated();
      const body = {
        ...update,
      };
      try {
        const res = await axios.put(
          `${Url}/user/${user._id}`,
          qs.stringify(body),
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res.data.user);
        setSuccess(true);
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const showSuccessMsg = () => {
    if (success) {
      return (
        <span className="badge badge-success">
          Your profile has been updated successfully!
        </span>
      );
    }
  };

  useEffect(() => {
    getUserInfo(userInfo, setUserInfo);
  }, []);

  return (
    <>
      <Layout
        title="Update your Profile"
        description="You can make any updates to your profile"
        className="container"
      >
        {showSuccessMsg()}
        <br />
        <form className="w-50">
          <div className="form-group">
            <label htmlFor="#name" className="text-muted">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="#email" className="text-muted">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="#password" className="text-muted">
              Password
            </label>
            <input
              type="text"
              name="password"
              id="password"
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button
            onClick={(e) => updateUserProfile(e, userUpdate)}
            className="btn btn-primary"
          >
            Update profile
          </button>
        </form>
      </Layout>
    </>
  );
};

export default Profile;
