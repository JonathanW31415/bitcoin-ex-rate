import React from "react";

export const Price = ({ price, symbol }) => {
  return (
    <div>
      <h1 className="font-weight-bold">
        1₿ = {symbol}
        {price}
      </h1>
    </div>
  );
};
