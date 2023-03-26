import React, { useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import qs from "qs";
import { Url } from "../../config";
import { isAuthenticated } from "../../helperMethods/functions";

const AddCategory = () => {
  const {
    user: { name },
    token,
  } = isAuthenticated();
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(false);
  const [notUnique, setNotUnique] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setError(false);
    setSuccess(false);
    setNotUnique(false);
    const { value } = e.target;
    setCategoryName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      category: categoryName,
    };
    axios
      .post(`${Url}/category/create`, qs.stringify(body), {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.error) {
          // if no errors
          setError(false);
          setNotUnique(false);
          setSuccess(true); //then set succes to true
        } else if (response.data.error.code !== undefined) {
          setNotUnique(true);
          setSuccess(false);
        } else {
          setError(true);
          setSuccess(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showSuccess = () => {
    if (success) {
      return (
        <h3 className="text-success">
          {categoryName} category was created successfully
        </h3>
      );
    }
  };
  const showError = () => {
    if (error) {
      return <h3 className="text-danger">something went wrong</h3>;
    }
  };
  const showNotUnique = () => {
    if (notUnique) {
      return <h3 className="text-danger">Category already exists</h3>;
    }
  };
  return (
    <>
      <Layout
        title="Add a category"
        description={`Good day, ${name}. Ready to add some new categories?`}
      />
      <div className="col-md-8 offset-md-2">
        {showSuccess()}
        {showError()}
        {showNotUnique()}
        <form>
          <div className="form-group">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              className="form-control"
              id="categoryName"
              name="name"
              autoFocus
              required
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
