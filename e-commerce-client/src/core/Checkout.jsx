import React, { useState } from "react";
import { useCart } from "react-use-cart";
import {
  isAuthenticated,
  clearCart,
  createOrder,
} from "../helperMethods/functions";
import { usePaystackPayment } from "react-paystack";

export default function Checkout() {
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [isAddress, setIsAddress] = useState(true);
  const { emptyCart, cartTotal, items } = useCart();

  const { user, token } = isAuthenticated();
  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: cartTotal * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const handleAddress = (e) => {
    setIsAddress(false);
    setAddress(e.target.value);
    if (e.target.value === "") {
      setIsAddress(true);
    }
  };

  const onSuccess = (reference) => {
    setSuccess(true);
    // Implementation for whatever you want to do with reference and after success call.
    setAddress("");

    const body = {
      order: [],
      amount: `₦${cartTotal}`,
      address,
      reference,
    };
    console.log(items);
    items.forEach((cartItem) => {
      const orderedItem = {
        name: cartItem.name,
        price: cartItem.price,
        decription: cartItem.description,
        category: cartItem.category,
        quantity: cartItem.quantity,
      };
      body.order.push(orderedItem);
    });
    clearCart(user._id, token);
    createOrder(user._id, token, body);
    emptyCart();
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const initializePayment = usePaystackPayment(config);
  const showSuccess = () => {
    if (success) {
      return (
        <div
          className="alert alert-info"
          style={{ display: success ? "" : "none" }}
        >
          Payment successful. Your order is being processed!
        </div>
      );
    }
  };

  const showQuantityAlert = () => {
    if (isAddress) {
      return (
        <span className="badge badge-danger">Please Enter an address</span>
      );
    }
  };
  return (
    <>
      <div>
        {showSuccess()}
        <textarea
          className="mb-3"
          cols={50}
          placeholder="Enter your address.."
          onChange={handleAddress}
          required
          value={address}
        />
        <h2>
          Total: ₦{cartTotal} <sup>{showQuantityAlert()}</sup>
        </h2>

        <button
          className="btn btn-success btn-block"
          onClick={() => {
            initializePayment(onSuccess, onClose);
          }}
          disabled={isAddress}
        >
          Checkout
        </button>
      </div>
    </>
  );
}
