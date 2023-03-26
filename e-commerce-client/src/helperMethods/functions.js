import axios from "axios";
import qs from "qs";
import { Url } from "../config.js";

import moment from "moment";

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const authenticate = (data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data)); //store the user and token in the local storage
  }
};

export const showStock = (quantity) => {
  return quantity > 0 ? (
    <span className="badge badge-primary badge-pill mb-1">In Stock</span>
  ) : (
    <span className="badge badge-danger badge-pill mb-1">Out of Stock</span>
  );
};

export const addToCartInDB = async (id) => {
  if (isAuthenticated() !== false) {
    const { token } = isAuthenticated();
    const productId = id;
    try {
      const res = await axios.post(`${Url}/user/cart/${productId}`, undefined, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export const deleteFromCart = async (id) => {
  if (isAuthenticated() !== false) {
    const { token } = isAuthenticated();
    const productId = id;

    try {
      await axios({
        url: `${Url}/user/cart/${productId}`,
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export const clearCart = async (id, token) => {
  try {
    const res = await axios.get(`${Url}/user/clear-cart/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const createOrder = async (id, token, data) => {
  try {
    const res = await axios.post(
      `${Url}/order/create/${id}`,
      qs.stringify(data),
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const getUserInfo = async (userInfo, setUserInfo) => {
  if (isAuthenticated() !== false) {
    const { token, user } = isAuthenticated();
    try {
      const res = await axios.get(`${Url}/user/${user._id}`, {
        headers: {
          Authorization: token,
        },
      });
      const { name, email, history, role } = res.data.profile;

      setUserInfo({ ...userInfo, name, email, role, history });
    } catch (e) {
      console.log(e);
    }
  }
};

export const purchaseHistory = (history) => {
  console.log(history);

  return (
    <>
      <div className="card mb-5">
        <h3 className="card-header">Purchase history</h3>
        <ul className="list-group">
          <li className="list-group-item">
            {history.map((h, i) => {
              return (
                <div key={i}>
                  <hr />
                  {h.products.map((p, i) => {
                    return (
                      <div key={i} className="text-center">
                        <h6>Product name: {p.name}</h6>
                        <h6>Product price: ₦{p.price}</h6>
                        <h6>Product Quantity: {p.quantity}</h6>
                        <hr width="90"/>
                      </div>
                    );
                  })}
                  <h6>Purchased date: {moment(h.createdAt).fromNow()}</h6>
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    </>
  );
};

export const deleteProduct = (token, productId) => {
  if (isAuthenticated() !== false) {
    axios
      .delete(`${Url}/product/${productId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => console.log(response))
      .catch((e) => console.log(e));
  }
};

