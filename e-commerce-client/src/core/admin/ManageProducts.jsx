import React, { useEffect, useState } from "react";

import { isAuthenticated, deleteProduct } from "../../helperMethods/functions";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { Url } from "../../config";

const UpdateProduct = () => {
  const [products, setProducts] = useState([]);
  const { token } = isAuthenticated();
  const getAllProducts = () => {
    if (isAuthenticated() !== false) {
      axios
        .get(`${Url}/products`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [products]);
  return (
    <>
      <Layout
        title="Manage Products"
        description="Update your products"
        className="container-fluid"
      >
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Total {products.length} products</h2>
            <ul className="list-group">
              {products.map((prod, i) => {
                return (
                  <>
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <strong>{prod.name}</strong>
                      <span>
                        <Link to={`/product/update/${prod._id}`}>
                          <span className="badge badge-warning badge-pill mr">
                            Update
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            deleteProduct(token, prod._id);
                            getAllProducts();
                          }}
                          className="badge badge-danger badge-pill cursor-pointer ml-3"
                        >
                          Delete Product
                        </button>
                      </span>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UpdateProduct;
