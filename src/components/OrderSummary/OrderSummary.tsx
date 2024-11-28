import { IItem, IProduct } from '@/utils/types';
import React, { useState } from 'react';

const OrderSummary = ({
  data,
  products,
}: {
  data: IItem[];
  products: IProduct[];
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const getProductName = (id: string) =>
    products?.find((product) => product.id === id)?.name;

  const pedidoLength = () => data.reduce((a, c) => a + c.quant, 0);

  const result = [...new Set(data.map((x) => x.productId))].map((x) => {
    return {
      productId: x,
      quant: data
        .filter((d) => d.productId === x)
        .reduce((a, c) => a + c.quant, 0),
    };
  });

  return (
    <>
      <div onClick={() => setShowSummary(!showSummary)}>{pedidoLength()}</div>
      {showSummary
        ? result.map((r) => (
            <p>
              {getProductName(r.productId)} - {r.quant}
            </p>
          ))
        : null}
    </>
  );
};

export default OrderSummary;
