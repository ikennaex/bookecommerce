import React, { useState } from "react";
import Layout from "./Layout";
import { Url } from "../config";
import { useCart } from "react-use-cart";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../helperMethods/functions";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  // const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setItems } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signin();
  };

  const handleInput = (e) => {
    e.preventDefault();
    setError(false);
    // setSuccess(false);
    const { name, value } = e.target;
    setUser((prevItems) => {
      return { ...prevItems, [name]: value };
    });
  };

  const signin = () => {
    const { email, password } = user;
    const body = {
      email,
      password,
    };

    axios
      .post(`${Url}/login`, qs.stringify(body)) //the qs module allows for easy parsing of inputdata using axios
      .then((response) => {
        if (!response.data.error) {
          //if no errors
          setLoading(false);
          setError(false);
          setItems(response.data.user.cart);//update the cart state with the user's cart
          // setSuccess(true);
          authenticate(response.data); // create user in the local storage

          navigate("/admin/dashboard");
        } else {
          setLoading(false);
          setError(true);
          // setSuccess(false);
        }
        setUser((prevItems) => {
          return { ...prevItems, email: "", password: "" };
        });
      })
      .catch((error) => {
        //handle any error
        // console.log(error);
        setError(error.response.data.error);
        setLoading(false);
      });
  };

  const login = () => {
    return (
      <>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <>
            <div className="alert alert-info">
              <h2>Loading...</h2>
            </div>
          </>
        ) : (
          ""
        )}
        <form>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter email"
              onChange={handleInput}
              name="email"
              value={user.email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              name="password"
              onChange={handleInput}
              value={user.password}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </>
    );
  };
  return (
    <>
      <Layout
        title="Log in to Your Account"
        className="container col-md-6"
        description="Login to your account and get started."
      >
        {login()}
      </Layout>
    </>
  );
}

export default Login;
