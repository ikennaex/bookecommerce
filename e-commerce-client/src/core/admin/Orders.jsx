import React, { useState, useEffect, useRef } from "react";
import Layout from "../Layout";
import axios from "axios";
import qs from "qs";
import moment from "moment";
import { Url } from "../../config";
import { isAuthenticated } from "../../helperMethods/functions";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const orderStatus = useRef();
  const orderId = useRef();
  const { token, user } = isAuthenticated();
  const loadOrders = async () => {
    if (isAuthenticated() !== false) {
      try {
        const res = await axios.get(`${Url}/order/list`, {
          headers: {
            Authorization: token,
          },
        });
        setOrders(res.data.orders);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getStatusValues = async () => {
    if (isAuthenticated() !== false) {
      try {
        const res = await axios.get(`${Url}/order/status-values`, {
          headers: {
            Authorization: token,
          },
        });

        setStatusValues(res.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const showInput = (key, value) => {
    return (
      <>
        <div className="input-group mb-2 mr-sm-2">
          <div className="input-group-prepend">
            <div className="input-group-text">{key}</div>
          </div>
          <input type="text" value={value} readOnly className="form-control" />
        </div>
      </>
    );
  };

  const handleStatusChange = async (e, id) => {
    orderStatus.current = e.target.value;
    orderId.current = id;
    const body = {
      orderStatus: orderStatus.current,
    };
    try {
      const res = await axios.put(
        `${Url}/order/${orderId.current}`,
        qs.stringify(body),
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res);
      loadOrders();
    } catch (e) {
      console.log(e);
    }
  };

  const showStatus = (order) => {
    return (
      <div className="form-group">
        <h3 className="mark mb-4">Status: {order.status}</h3>
        <select
          className="form-control"
          onChange={(e) => {
            handleStatusChange(e, order._id);
          }}
        >
          <option>Update Status</option>
          {statusValues.map((status, index) => {
            return (
              <option key={index} value={status}>
                {status}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const noOrders = () => {
    if (orders.length < 1) {
      return <h3>No Orders</h3>;
    }
  };
  useEffect(() => {
    loadOrders();
    getStatusValues();
  }, []);

  return (
    <>
      <Layout
        title="Orders"
        description={`Good day, ${user.name}. Here are the orders`}
        className="container"
      >
        {orders.length > 0 ? (
          <h3 className="">
            You have {orders.length} {orders.length == 1 ? "Order" : "Orders"}
          </h3>
        ) : (
          noOrders()
        )}
        {orders.map((order, index) => {
          return (
            <>
              <div
                className="mt-5"
                style={{ borderBottom: "5px solid indigo" }}
                key={index}
              >
                <h2 className="mb-3">
                  <span className="bg-primary">Order ID: {order._id}</span>
                </h2>
                <ul className="list-group mb-2">
                  <li className="list-group-item">{showStatus(order)}</li>
                  <li className="list-group-item">
                    Transaction Ref: {order.reference.trxref}
                  </li>
                  <li className="list-group-item">
                    Amount Paid: {order.amount}
                  </li>
                  <li className="list-group-item">
                    Ordered By: {order.user.name} ({order.user.email})
                  </li>
                  <li className="list-group-item">
                    Order TimeStamp: {moment(order.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    Delivery Address: {order.address}
                  </li>
                </ul>

                <h3 className="mt-2 mb-2 font-italic">
                  Total Products in the order: {order.products.length}
                </h3>

                {order.products.map((product, index) => {
                  return (
                    <div
                      className="mb-4"
                      key={index}
                      style={{ padding: "20px", border: "1px solid indigo" }}
                    >
                      {showInput("Product Name", product.name)}
                      {showInput("Product Total:", product.quantity)}
                      {showInput("Product Price:", product.price)}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      </Layout>
    </>
  );
};

export default Orders;
