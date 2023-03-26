import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import axios from "axios";
import { isAuthenticated } from "../../helperMethods/functions";
import { Url } from "../../config";

const AddProduct = () => {
  const {
    user: { name },
    token,
  } = isAuthenticated();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${Url}/categories`)
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => console.log(error));
  }, []);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    shipping: "",
    quantity: "",
  });
  const [fileKey, setFileKey] = useState(0);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [notUnique, setNotUnique] = useState(false);
  const [photo, setPhoto] = useState("");

  const {
    name: productName,
    description,
    category,
    price,
    shipping,
    quantity,
  } = product;

  let formData = new FormData(); //formdata object

  const handleInputChange = (event) => {
    setSuccess(false);
    setError(false);
    setNotUnique(false);
    if (event.target.files) {
      // handle any files in the input
      console.log(event.target.files);
      setPhoto(event.target.files[0]);
    } else {
      const { name, value } = event.target;
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = () => {
    setError(false);

    formData.append("name", productName); //append the values with key, value pair
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("shipping", shipping);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("photo", photo);

    const config = {
      headers: { "content-type": "multipart/form-data", Authorization: token },
    };

    axios
      .post(`${Url}/product/create`, formData, config)
      .then((response) => {
        console.log(response);
        if (!response.data.error) {
          setSuccess(true);
          setError(false);
          setNotUnique(false);
          setProduct({
            name: "",
            description: "",
            category: "",
            quantity: "",
            price: "",
            shipping: "",
          });
        } else if (
          response.data.error.includes("Error uploading image: E11000")
        ) {
          setNotUnique(true);
          setSuccess(false);
          console.log(response.data.error);
        } else {
          setSuccess(false);
          setError(true);
          setErrorMsg(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const functionThatResetsTheFileInput = () => {
    //this targets the key attribute in the "file" type input
    let randomString = Math.random().toString(36);
    setFileKey(randomString);
  };
  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">Product added successfully!</h3>;
    }
  };
  const showError = () => {
    if (error) {
      return <h3 className="text-danger">{errorMsg}</h3>;
    }
  };
  const showNotUnique = () => {
    if (notUnique) {
      return <h3 className="text-danger">Product already exists</h3>;
    }
  };
  return (
    <>
      <Layout
        title="Add a product!"
        description={`Good day, ${name}. Ready to add some new products?`}
      />
      <div className="col-md-8 offset-md-2">
        {showSuccess()}
        {showError()}
        {showNotUnique()}
        <form>
          <h4>Post photo</h4>
          <div className="form-group">
            <label htmlFor="productPhoto" className="btn btn-secondary">
              <input
                type="file"
                name="photo"
                id="productPhoto"
                onChange={handleInputChange}
                key={fileKey} 
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="productName">Name</label>
            <input
              type="text"
              className="form-control"
              id="productName"
              name="name"
              required
              onChange={handleInputChange}
              value={product.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <input
              type="text"
              className="form-control"
              id="productDescription"
              name="description"
              required
              onChange={handleInputChange}
              value={product.description}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productPrice">Price</label>
            <input
              type="number"
              className="form-control"
              id="productPrice"
              name="price"
              min={0}
              required
              onChange={handleInputChange}
              value={product.price}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productCategory">Category</label>
            <select
              name="category"
              className="form-control"
              onChange={handleInputChange}
              value={product.category}
            >
              <option>Please select</option>
              {categories.map((category, i) => {
                return (
                  <option key={i} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="productQuantity">Quantity</label>
            <input
              type="number"
              className="form-control"
              id="productQuantity"
              name="quantity"
              min={0}
              required
              onChange={handleInputChange}
              value={product.quantity}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productName">Shipping</label>
            <select
              name="shipping"
              className="form-control"
              onChange={handleInputChange}
              value={product.shipping}
            >
              <option>Please select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit();
              functionThatResetsTheFileInput();
            }}
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
