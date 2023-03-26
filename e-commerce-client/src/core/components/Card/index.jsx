import moment from "moment";
import "./card.css";
import React, { useState } from "react";
import axios from "axios";
import { Url } from "../../../config";
import { useNavigate } from "react-router-dom";
import Image from "../Image";
import { useCart } from "react-use-cart";
import {
  isAuthenticated,
  showStock,
  addToCartInDB,
  deleteFromCart,
} from "../../../helperMethods/functions";
import { useEffect } from "react";

const Card = ({
  id,
  name,
  description,
  price,
  category,
  quantity,
  showAddToCartButton = true,
  createdAt,
}) => {
  const { user } = isAuthenticated();
  const [error, setError] = useState(false);
  const [dbQuantity, setDbQuantity] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartUpdate, setCartUpdate] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id,
    name,
    description,
    price,
    category,
    quantity,
    createdAt,
  });
  const { updateItemQuantity, addItem, removeItem, inCart, onItemAdd } =
    useCart();

  const handleChange = (e) => {
    setError(false);
    if (isAuthenticated() !== false) {
      console.log(e.target);
    }
  };

  const getDBQuantity = async () => {
    try {
      const res = await axios.get(`${Url}/product/${id}`);
      setDbQuantity(res.data?.product.quantity);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      if (inCart(id)) {
        setAddedToCart(true);
      }
    }
    getDBQuantity();
  }, []);
  return (
    <>
      <div className="card-component">
        <span
          className="info-icon"
          data-toggle="tooltip"
          data-placement="top"
          title={`Details about ${name}`}
          onClick={() => {
            navigate(`/product/${id}`);
          }}
        >
          <i className="fa-solid fa-circle-info"></i>
        </span>
        <span className="stock-icon">{showStock(quantity)}</span>
        <div className="product-img-container">
          <Image id={id} className={"product-img"} />
        </div>

        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-description">{description}</p>
          <p className="product-price">₦{price}</p>
          <p>Added {moment(createdAt).fromNow()}</p>
        </div>
        {showAddToCartButton ? (
          <div
            className="add-to-cart-btn"
            onClick={() => {
              if (isAuthenticated() !== false) {
                if (quantity > 0) {
                  setAddedToCart(true);
                  addToCartInDB(id);
                  addItem(product);
                }
              } else {
                navigate("/login");
              }
            }}
          >
            {addedToCart ? (
              <>
                <span>ADDED TO CART</span>
                <i className="fa-regular fa-circle-check"></i>
              </>
            ) : (
              "ADD TO CART"
            )}
          </div>
        ) : (
          <div className="update-cart">
            <button
              className="remove-from-cart-btn"
              onClick={() => {
                deleteFromCart(id);
                removeItem(id);
              }}
            >
              Remove from cart
            </button>
            <div className="">
              <button className="cart-btn btn btn-warning decrement-btn mr-3 rounded"
                onClick={() => {
                  if (cartQuantity > 1) {
                    setCartQuantity(cartQuantity - 1);
                    updateItemQuantity(id, cartQuantity - 1);
                  }
                }}
              >
                -
              </button>
              <span>{cartQuantity}</span>
              <button className="cart-btn btn btn-success increment-btn ml-3 rounded"
                onClick={() => {
                  if (cartQuantity < dbQuantity) {
                    setCartQuantity(cartQuantity + 1);
                    updateItemQuantity(id, cartQuantity + 1);
                  }
                }}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Card;
