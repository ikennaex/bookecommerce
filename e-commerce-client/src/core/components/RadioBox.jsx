import React from "react";
import { prices } from "../../helperMethods/prices";

// imported the handlesubmit function to trigger it whenever we toggle on the 
// radio buttons
const RadioBox = ({ setRange }) => {
  const handleToggle = (e) => {
    const { value } = e.target;
    setRange(value);
  };

  return (
    <>
      {prices.map((price, i) => {
        return (
          <>
            <div key={i}>
              <input
                key={i}
                id={price.id}
                value={price.array}
                type="radio"
                onChange={handleToggle}
                name="range"
              />
              <label htmlFor={price.id}>{price.name}</label>
            </div>
          </>
        );
      })}
    </>
  );
};

export default RadioBox;
