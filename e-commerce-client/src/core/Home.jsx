import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Card from "./components/Card";
import { Url } from "../config";
import LoadingSpinner from "./components/LoadingSpinner";
import axios from "axios";
function Home() {
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    
    setFetching(true);
    (async () => {
      try {
        const res = await axios.get(`${Url}/products`, {
          params: {
            arrival: "desc",
            limit: 4,
          },
        });
        if (!res.data.error) {
          setProducts(res.data);
        }
      } catch (error) {
        console.log(error);
      }
      setFetching(false);
    })();
  }, []);
  return (
    <>
      <Layout
        title="Home Page"
        description="Node React E-commerce App"
        className="container-fluid"
      >
        <h1>Newest arrivals!</h1>
        <div className={`${fetching ? "" : "d-flex flex-wrap"}`}>
          {fetching && <LoadingSpinner />}
          {products.map((product, i) => {
            return (
              <Card
                key={i}
                id={product._id}
                name={product.name}
                description={product.description}
                category={product.category?.name}
                createdAt={product.createdAt}
                quantity={product.quantity}
                price={product.price}
                showDeleteFromCartButton={false}
              />
            );
          })}
        </div>
      </Layout>
    </>
  );
}

export default Home;
