import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../../helperMethods/functions";
import { Url } from "../../config";

const UpdateProduct = () => {
  const {
    user: { name },
    token,
  } = isAuthenticated();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
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
  const { productId } = useParams();

  const getSingleProduct = (productId) => {
    axios
      .get(`${Url}/product/${productId}`)
      .then((response) => {
        const { product } = response.data;
        console.log(product);
        setProduct((prevProduct) => {
          return {
            ...prevProduct,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            price: product.price,
            shipping: product.shipping,
          };
        });
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getSingleProduct(productId);
  }, []);
  useEffect(() => {
    axios
      .get(`${Url}/categories`)
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => console.log(error));
  }, []);
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
      console.log(name, value);
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = () => {
    setError(false);
    formData.append("name", productName); //append the values with key, value pair
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("shipping", shipping);
    formData.append("category", category._id);
    formData.append("price", price);
    if (photo) {
      formData.append("photo", photo);
    }

    const config = {
      headers: { "content-type": "multipart/form-data", Authorization: token },
    };

    axios
      .patch(`${Url}/product/${productId}`, formData, config)
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
          setTimeout(() => {
            navigate("/");
          }, 2500);
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
      return <h3 className="text-success">Product updated successfully!</h3>;
    }
  };
  const showError = () => {
    if (error) {
      return <h3 className="text-danger">{errorMsg}</h3>;
    }
  };
  return (
    <>
      <Layout
        title="Update product!"
        description={`Good day, ${name}. Update ${product.name}`}
      />
      <div className="col-md-8 offset-md-2">
        {showSuccess()}
        {showError()}
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
              value={product.category._id}
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
              e.preventDefault();
              handleSubmit();
              functionThatResetsTheFileInput();
            }}
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
