import React, { useEffect } from "react";
import { useCart } from "react-use-cart";
import { isAuthenticated, clearCart } from "../helperMethods/functions";
import axios from "axios";
import { Url } from "../config";
import { Link } from "react-router-dom";
import Card from "./components/Card";
import Checkout from "./Checkout";
import Layout from "./Layout";

const Cart = () => {
  const { items, setItems, emptyCart } = useCart();
  const { token, user = "" } = isAuthenticated(); //incase you're not logged in
  const getCartItems = () => {
    axios
      .get(`${Url}/user/${user._id ? user._id : ""}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setItems(response.data.profile.cart);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCartItems();
  }, []);

  const noItemsMessage = () => {
    return (
      <h2>
        No items in your cart. <Link to="/shop"> Continue shopping</Link>
      </h2>
    );
  };
  const emptyCartItems = () => {
    if (items.length > 0) {
      return (
        <button
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              emptyCart();
              clearCart(user._id, token);
            }
          }}
        >
          Empty Cart!
        </button>
      );
    }
  };
  const showCartItems = () => {
    return (
      <>
        
        <h2 className="text-center mb-2">
          Your cart has {items.length} {items.length > 1 ? "items" : "item"}
        </h2>
        <div className="d-flex flex-wrap">
          {items.map((product, i) => {
            // console.log(product.)
            return (
              <span>
                <Card
                  key={i}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  quantity={product.quantity}
                  createdAt={product.createdAt}
                  showAddToCartButton={false}
                  showDeleteFromCartButton={true}
                  showCheckoutButton={true}
                  cartUpdate={true}
                />
              </span>
            );
          })}
        </div>
        {emptyCartItems()}
      </>
    );
  };
  return (
    <>
      <Layout
        title="Your cart"
        description={`Check out items in your cart, ${user?.name}!`}
        className="container-fluid"
      >
        <div className="d-md-flex row">
          <div className="col-sm-6">
            <h2>Your Cart summary</h2>
            <Checkout
              cart={items}              
            />
          </div>
          <div>
            {items.length > 0 ? showCartItems() : noItemsMessage()}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Cart;
