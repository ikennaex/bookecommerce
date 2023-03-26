import React from "react";
import moment from "moment";
import Image from "./Image";
import { Link } from "react-router-dom";
import {
  showStock,
  addToCartInDB,
  deleteFromCart,
} from "../../helperMethods/functions";

const RelatedCard = ({
  id,
  name,
  price,
  description,
  quantity,
  category,
  showDeleteFromCartButton = false,
  showViewProductButton = true,
  showAddToCartButton = true,
  showCheckoutButton = false,
  createdAt,
}) => {
  return (
    <>
      <div className="card product-card mb-3 mx-3">
        <div className="card-header">{name}</div>
        <div className="card-body">
          <div>
            <Image id={id} className={"product-image"} />
          </div>
          <div className="ml-2">
            {showStock(quantity)}
            <p className="lead mt-2">{description}</p>
            <p className="black-9">${price}</p>
            <p>{category ? `Category: ${category}` : ""}</p>
            <p>Added {moment(createdAt).fromNow()}</p>

            {showViewProductButton && (
              <Link
                to={`/product/${id}`}
                className="btn btn-outline-primary mr-2"
              >
                View Product
              </Link>
            )}
            {showAddToCartButton && quantity > 0 && (
              <button
                onClick={() => {
                  addToCartInDB(id);
                }}
                className="btn btn-outline-success"
              >
                Add to Cart
              </button>
            )}
            {showCheckoutButton && (
              <button className="btn btn-outline-success mr-2">Checkout</button>
            )}
            {showDeleteFromCartButton && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteFromCart(id);
                }}
              >
                Remove Product
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RelatedCard;
