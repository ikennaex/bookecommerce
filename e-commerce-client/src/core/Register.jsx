import React, { useState } from "react";
import Layout from "./Layout";
import { Url } from "../config";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    setError(false);
    setSuccess(false);
    e.preventDefault();
    const { name, value } = e.target;
    setUser((prevItems) => {
      return { ...prevItems, [name]: value };
    });
  };

  const signup = () => {
    const { name, email, password } = user;
    const body = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post(`${Url}/register`, qs.stringify(body)) //the qs module allows for easy parsing of inputdata using axios
      .then((response) => {
        // console.log(response.data);
        if (!response.data.error) {
          setError(false);
          setSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          console.log(response.data);
          setError(true);
          setSuccess(false);
        }
        setUser((prevItems) => {
          return { ...prevItems, name: "", email: "", password: "" };
        });
      })
      .catch((error) => {
        //handle any axios errors
        console.log(error);
        setError(error.response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup();
  };

  const showSuccess = () => {
    if (success) {
      return (
        <h3 className="text-success">
          Registration successful! Redirecting you to the login page..
        </h3>
      );
    }
  };
  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Uh oh! {error}</h3>;
    }
  };

  const registerForm = () => {
    return (
      <>
        <form>
          <div className="form-group">
            <label htmlFor="InputName">Name</label>
            <input
              type="text"
              className="form-control"
              id="InputName"
              placeholder="Enter Name"
              onChange={handleInput}
              name="name"
              value={user.name}
            />
          </div>
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
        title="Register your Account"
        description="Create an account with us!"
        className="container col-md-6"
      >
        {showError()}
        {showSuccess()}
        {registerForm()}
      </Layout>
    </>
  );
}

export default Register;
