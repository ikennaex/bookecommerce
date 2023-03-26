import React from "react";
import { Url } from "../../config";

const Image = ({ id, className }) => {
  return (
    <>
      <div>
        <img
          src={`${Url}/product/photo/${id}`}
          alt=""
          className={`${className} m-1`}
        />
      </div>
    </>
  );
};

export default Image;
