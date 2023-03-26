import React, { useState, useRef } from "react";
import Layout from "./Layout";
import Card from "./components/Card";
import { Url } from "../config";
import RadioBox from "./components/RadioBox";
import axios from "axios";

const Shop = () => {
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [size, setSize] = useState(0);
  let [range, setRange] = useState("");
  const query = useRef();

  const handleInput = (e) => {
    const { value } = e.target;

    query.current = value;
    //use useRef instead
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let rangeArr = range !== "" ? range.split(",") : undefined;

    axios({
      method: "post",
      url: `${Url}/products/search`,
      params: {
        q: query.current,
        min: rangeArr !== undefined ? parseInt(rangeArr[0]) : "",
        max: rangeArr !== undefined ? parseInt(rangeArr[1]) : "",
      },
    })
      .then((response) => {
        setError(false);
        setProducts(response.data.products);
        setSize(response.data.size);
        console.log(products);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };
  return (
    <>
      <Layout
        title="Shop Page"
        description="Shop for your favourite books now!"
        className="container-fluid"
      >
        <h4 className="mb-3 text-center">Search for products!</h4>
        <form
          action=""
          onSubmit={handleSubmit}
          className="mb-5 w-50 text-center mx-auto"
        >
          <input
            type="text"
            name="query"
            onChange={handleInput}
            className="form-control mb-2"
          />
          <button type="submit" className="btn btn-success">
            Search
          </button>
        </form>
        <div className="row">
          <div className="col-lg-4">
            <h3>Filter by Price</h3>
            <RadioBox setRange={setRange} />
          </div>
          <div className="col-lg-8 border p-3 rounded">
            <div className="d-flex flex-wrap">
              {error ? (
                <p className="text-center">No products found</p>
              ) : (
                <p>{size} products found</p>
              )}
              {products !== [] &&
                error === false &&
                products.map((product, index) => {
                  return (
                    <>
                      <Card
                        key={index}
                        id={product._id}
                        name={product.name}
                        quantity={product.quantity}
                        description={product.description}
                        price={product.price}
                        showDeleteFromCartButton={false}
                      />
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Shop;
