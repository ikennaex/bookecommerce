import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Url } from "../../config";
import Layout from "../Layout";
import Card from "./Card";
import RelatedCard from "./RelatedCard";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${Url}/product/${productId}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data.product);
      })
      .catch((error) => console.log(error));
  }, [productId]);

  useEffect(() => {
    axios
      .get(`${Url}/products/related/${productId}`)
      .then((response) => {
        console.log(response.data);
        setRelatedProducts(response.data.products);
      })
      .catch((error) => console.log(error));
  });
  return (
    <>
      <Layout
        title={product.name}
        description={product.description}
        className="container"
      >
        <div className="row">
          <div className="col-md-8">
            <Card
              key={product._id}
              id={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              category={product.category?.name}
              createdAt={product.createdAt}
              quantity={product.quantity}
              showViewProductButton={false}
              showDeleteFromCartButton={false}
            />
          </div>

          <div className="col-md-4">
            {relatedProducts.length > 0 ? (
              <>
                <h4>Related Products</h4>
                {relatedProducts.map((prod, i) => {
                  return (
                    <RelatedCard
                      key={prod._id}
                      id={prod._id}
                      name={prod.name}
                      description={prod.description}
                      price={prod.price}
                      category={prod.category?.name}
                      createdAt={prod.createdAt}
                      quantity={prod.quantity}
                      showViewProductButton={true}
                      showDeleteFromCartButton={false}
                    />
                  );
                })}
              </>
            ) : (
              <h4>No related Products</h4>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Product;
